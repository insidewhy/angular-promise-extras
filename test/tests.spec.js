'use strict';

describe('angular-promise-extras', function () {
  beforeEach(module('ngPromiseExtras'))

  var $q, $rootScope

  beforeEach(inject(function (_$q_, _$rootScope_) {
    $q = _$q_
    $rootScope = _$rootScope_
  }))

  describe('$q.allSettled', function () {
    var deferreds, proms

    beforeEach(function () {
      deferreds = [$q.defer(), $q.defer(), $q.defer()]
      proms = deferreds.map(function (deferred) {
        return deferred.promise
      })
    })

    it('works when passed an array', function (done) {
      proms.push(4)

      $q.allSettled(proms).then(function (results) {
        expect(results[0].state).toBe('fulfilled')
        expect(results[1].state).toBe('rejected')
        expect(results[2].state).toBe('fulfilled')
        expect(results[0].value).toBe(1)
        expect(results[1].reason).toBe(2)
        expect(results[3].value).toBe(4)
      })
        .then(done, done.fail)

      deferreds[0].resolve(1)
      deferreds[1].reject(2)
      deferreds[2].resolve(3)
      $rootScope.$apply()

      done()
    })

    it('works when passed a hash', function (done) {
      var promsObj = {
        a: proms[0],
        b: proms[1],
        c: proms[2]
      }

      $q.allSettled(promsObj).then(function (results) {
        expect(results.a.state).toBe('fulfilled')
        expect(results.b.state).toBe('rejected')
        expect(results.c.state).toBe('fulfilled')
        expect(results.a.value).toBe(1)
        expect(results.b.reason).toBe(2)
        expect(results.c.value).toBe(3)
      })
        .then(done, done.fail)

      deferreds[0].resolve(1)
      deferreds[1].reject(2)
      deferreds[2].resolve(3)

      $rootScope.$apply()
      done()
    })
  })

  describe('$q.map', function () {
    it('works when passed an array', function (done) {
      var values = [1, 2, 3]
      $q.map(values, function (val, idx) {
        return $q(function (resolve) {
          resolve(val * idx)
        })
      })
        .then(function (vals) {
          expect(vals).toEqual([0, 2, 6])
        })
        .then(done, done.fail)

      $rootScope.$apply()
      done()
    })

    it('works when passed an object', function (done) {
      var values = {a: 1, b: 2, c: 3}
      $q.map(values, function (val, key) {
        return $q(function (resolve) {
          resolve(key + ':' + val)
        })
      })
        .then(function (vals) {
          expect(vals).toEqual({a: 'a:1', b: 'b:2', c: 'c:3'})
        })
        .then(done, done.fail)

      $rootScope.$apply()
      done()
    })
  })

  describe('$q.resolve', function () {
    it('resolves to the promise when passed a thenable', function (done) {
      $q.resolve(
        $q(function (resolve) {
          resolve('votegreen')
        })
      )
        .then(function (value) {
          expect(value).toBe('votegreen')
        })

      $rootScope.$apply()
      done()
    })

    it('resolves to the promise that returns a value when passed a value', function (done) {
      $q.resolve('damn the conservatives')
        .then(function (value) {
          expect(value).toBe('damn the conservatives')
        })

      $rootScope.$apply()
      done()
    })
  })
})
