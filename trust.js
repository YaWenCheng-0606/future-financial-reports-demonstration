/*
 * Honeycomb research prototype — local evidence-chain demonstration.
 * Actual SHA-256 hashes; no blockchain network, consensus, trusted timestamp,
 * production authorization, or cryptographic vLEI validation.
 * This file contains no secrets and makes no network requests.
 */
(function (global) {
  'use strict';

  var GENESIS_HASH = '0'.repeat(64);
  var DISCLAIMER = 'Local SHA-256 hash-chain demonstration, not a deployed blockchain. '
    + 'Verification checks consistency with the stored hashes. An independently held '
    + 'anchor is needed to detect a completely rewritten history.';

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canonical(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    return '{' + Object.keys(value).sort().map(function (key) {
      return JSON.stringify(key) + ':' + canonical(value[key]);
    }).join(',') + '}';
  }

  function payload(record) {
    var result = Object.assign({}, record);
    delete result.hash;
    return result;
  }

  function unavailableError() {
    var error = new Error('Web Crypto SHA-256 is unavailable. Open this demo over HTTPS or localhost. No substitute hashes were created.');
    error.code = 'CRYPTO_UNAVAILABLE';
    return error;
  }

  function utc(value) {
    var parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime())) throw new TypeError('A valid date is required.');
    return parsed.toISOString();
  }

  class DemoLedger {
    constructor(options) {
      options = options || {};
      this.mode = 'local-hash-chain-demo';
      this.disclaimer = DISCLAIMER;
      this._subtle = options.subtle === undefined
        ? (global.crypto && global.crypto.subtle)
        : options.subtle;
      this.available = !!(this._subtle && typeof this._subtle.digest === 'function' && global.TextEncoder);
      this._clock = typeof options.clock === 'function' ? options.clock : Date.now;
      this.onChange = typeof options.onChange === 'function' ? options.onChange : null;
      this._records = [];
      this._queue = Promise.resolve();
      this.lastNotificationError = null;
      this.ready = this.reset();
    }

    _enqueue(job) {
      var next = this._queue.then(job);
      // A failed append must not prevent later valid events from being recorded.
      this._queue = next.catch(function () {});
      return next;
    }

    async _digest(value) {
      if (!this.available) throw unavailableError();
      var bytes = new global.TextEncoder().encode(canonical(value));
      var digest = await this._subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest)).map(function (byte) {
        return byte.toString(16).padStart(2, '0');
      }).join('');
    }

    _notify(record) {
      if (!this.onChange) return;
      try {
        this.onChange(this.exportRecords(), record ? copy(record) : null);
        this.lastNotificationError = null;
      } catch (error) {
        // UI notification failure is separate from a successfully recorded event.
        this.lastNotificationError = error;
      }
    }

    async _append(action, detail, role) {
      if (!this.available) throw unavailableError();
      if (typeof action !== 'string' || !action.trim()) {
        throw new TypeError('An event action must be a nonempty string.');
      }
      var cleanDetail = copy(detail === undefined ? {} : detail);
      var index = this._records.length;
      var record = {
        index: index,
        id: 'EVT-' + String(index + 1).padStart(4, '0'),
        timestamp: utc(this._clock()),
        action: action.trim(),
        role: String(role || 'system'),
        detail: cleanDetail,
        prevHash: index ? this._records[index - 1].hash : GENESIS_HASH
      };
      record.hash = await this._digest(record);
      this._records.push(record);
      this._notify(record);
      return copy(record);
    }

    append(action, detail, role) {
      var self = this;
      // Snapshot at invocation so a caller cannot change an event while it waits.
      var snapshot;
      try {
        snapshot = copy(detail === undefined ? {} : detail);
      } catch (error) {
        return Promise.reject(new TypeError('Event detail must be JSON serializable.'));
      }
      return this._enqueue(function () { return self._append(action, snapshot, role); });
    }

    async _verifyRecords(records) {
      var base = {
        mode: this.mode,
        available: this.available,
        count: Array.isArray(records) ? records.length : 0,
        scope: DISCLAIMER
      };
      function failure(index, message) {
        return Object.assign({}, base, { ok: false, brokenAt: index, message: message });
      }
      if (!this.available) return failure(null, unavailableError().message);
      if (!Array.isArray(records) || !records.length) {
        return failure(null, 'No records are available to verify.');
      }
      var previous = GENESIS_HASH;
      for (var i = 0; i < records.length; i += 1) {
        var record = records[i];
        if (!record || typeof record !== 'object' || record.index !== i
          || record.id !== 'EVT-' + String(i + 1).padStart(4, '0')) {
          return failure(i, 'Record order or identifier has changed at event ' + (i + 1) + '.');
        }
        if (record.prevHash !== previous) {
          return failure(i, 'The link to the preceding record does not match at event ' + (i + 1) + '.');
        }
        if (typeof record.hash !== 'string' || !/^[a-f0-9]{64}$/.test(record.hash)) {
          return failure(i, 'The stored SHA-256 digest is missing or malformed at event ' + (i + 1) + '.');
        }
        var calculated;
        try {
          calculated = await this._digest(payload(record));
        } catch (error) {
          return failure(i, 'Unable to hash event ' + (i + 1) + ': ' + error.message);
        }
        if (calculated !== record.hash) {
          return Object.assign(failure(i, 'Payload changed: SHA-256 verification failed at event ' + (i + 1) + '.'), {
            storedHash: record.hash,
            calculatedHash: calculated
          });
        }
        previous = record.hash;
      }
      return Object.assign({}, base, {
        ok: true,
        brokenAt: null,
        headHash: previous,
        message: 'All ' + records.length + ' local records match their hashes and preceding links.'
      });
    }

    verify(records) {
      var self = this;
      var hasSupplied = records !== undefined;
      var supplied = hasSupplied ? copy(records) : null;
      return this._enqueue(function () {
        return self._verifyRecords(hasSupplied ? supplied : self._records);
      });
    }

    tamperAndVerify(index) {
      var self = this;
      return this._enqueue(async function () {
        if (!self.available) return self._verifyRecords([]);
        var changed = self.exportRecords();
        if (!changed.length) return self._verifyRecords(changed);
        var target = index === undefined ? Math.min(1, changed.length - 1) : Number(index);
        if (!Number.isInteger(target) || target < 0 || target >= changed.length) {
          throw new RangeError('Tamper demonstration index is outside the ledger.');
        }
        // Alter a copy only. The stored hash is deliberately left unchanged.
        changed[target].detail = {
          originalDetail: changed[target].detail,
          injectedChange: 'DEMO: a value was changed after this record was hashed.'
        };
        var check = await self._verifyRecords(changed);
        var original = await self._verifyRecords(self._records);
        return Object.assign({}, check, {
          demonstration: true,
          copiedRecordId: changed[target].id,
          originalUnchanged: original.ok,
          message: check.message + ' Only a copy was changed; the live demo history remains intact.'
        });
      });
    }

    tamperDemo(index) {
      return this.tamperAndVerify(index);
    }

    reset() {
      var self = this;
      return this._enqueue(async function () {
        self._records = [];
        if (!self.available) {
          self._notify(null);
          return null;
        }
        return self._append('ledger_initialized', {
          purpose: 'Academic demonstration of source, access, and version evidence.',
          securityBoundary: 'Browser memory only; no production access control.',
          verification: 'Actual SHA-256 hashing; no distributed blockchain or independent anchor.'
        }, 'system');
      });
    }

    exportRecords() {
      return copy(this._records);
    }
  }

  function validateCredential(source, options) {
    source = source || {};
    options = options || {};
    var checkedAt;
    try { checkedAt = utc(options.now === undefined ? Date.now() : options.now); }
    catch (error) { checkedAt = null; }
    var organization = source.organizationId || source.lei || source.vlei;
    var hasOrganization = typeof organization === 'string' && organization.trim().length > 0;
    var hasAgent = typeof source.agent === 'string' && source.agent.trim().length > 0;
    var hasScope = Array.isArray(source.scope) ? source.scope.length > 0 : !!source.scope;
    var expiry = source.expires || source.validUntil;
    var expiryTime = expiry ? new Date(expiry).getTime() : null;
    var expired = !!options.expired || (expiry && (!Number.isFinite(expiryTime)
      || !checkedAt || expiryTime <= new Date(checkedAt).getTime()));
    var identity = hasOrganization && !options.credentialRevoked;
    var delegation = hasAgent && hasScope && !options.revoked && !expired;
    var integrity = !options.tampered;
    var checks = {
      identity: {
        id: 'identity',
        label: 'Organization identity · simulated',
        passed: !!identity,
        explanation: identity
          ? 'The scenario links the provider to its demo organization identifier. This is not an issued vLEI credential.'
          : 'The demo organization identifier is missing or its simulated credential is revoked.'
      },
      delegation: {
        id: 'delegation',
        label: 'Agent mandate · simulated',
        passed: !!delegation,
        explanation: options.revoked
          ? 'This scenario withdraws the agent mandate. New data from this agent is blocked.'
          : expired
            ? 'The simulated mandate has expired or has an invalid validity date.'
            : delegation
              ? 'The demo agent has a defined mandate and scope. Production checks require real authority and policy evidence.'
              : 'The demo agent identity or mandate scope is missing.'
      },
      integrity: {
        id: 'integrity',
        label: 'Response signature · simulated',
        passed: !!integrity,
        explanation: integrity
          ? 'The scenario represents a matching signed response. No real issuer signature or financial content is validated.'
          : 'The scenario represents a response modified after signing. The source is blocked.'
      }
    };
    var accepted = !!(identity && delegation && integrity && checkedAt);
    return {
      accepted: accepted,
      simulated: true,
      verifiedCryptographically: false,
      checkedAt: checkedAt,
      status: accepted ? 'demo-accepted' : 'demo-blocked',
      checks: checks,
      checkList: Object.keys(checks).map(function (key) { return checks[key]; }),
      message: accepted
        ? 'Simulated source checks pass. This verifies neither a real vLEI nor the economic accuracy of the data.'
        : 'Simulated source checks fail. Exclude this source from new analysis until the issue is resolved.'
    };
  }

  global.DemoLedger = DemoLedger;
  global.createDemoLedger = function (options) { return new DemoLedger(options); };
  global.validateCredential = validateCredential;
})(typeof window !== 'undefined' ? window : globalThis);
