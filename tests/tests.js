describe('tests', function(){
  var should = require('should');
  var plugin = require('../index');
  var handler;
  var p = {
    ext: function(event, fn){
      handler = fn;
    },
    log: function(){}
  };

  it('should register the plugin', function(done){
    plugin.register(p, {}, function(){
      handler.should.not.eql(null);
      done();
    });
  });

  it('should correctly parse a simple header', function(done){
    var request = {
      pre: {},
      raw: {
        req: {
          headers: {
            'accept-language': 'en-US,en;q=0.8'
          }
        }
      },
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){
      request.pre.language[0].should.eql({
        code: 'en',
        region: 'US',
        quality: 1.0
      });

      request.pre.language[1].should.eql({
        code: 'en',
        region: undefined,
        quality: 0.8
      });

      done();
    }});
  });

  it('should correctly parse a complex header', function(done){
    var request = {
      pre: {},
      raw: {
        req: {
          headers: {
            'accept-language': 'fr-CA,fr;q=0.8,en-US;q=0.6,en;q=0.4,*;q=0.1'
          }
        }
      },
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){

      request.pre.language[0].should.eql({
        code: 'fr',
        region: 'CA',
        quality: 1.0
      });

      request.pre.language[1].should.eql({
        code: 'fr',
        region: undefined,
        quality: 0.8
      });

      request.pre.language[2].should.eql({
        code: 'en',
        region: 'US',
        quality: 0.6
      });

      request.pre.language[3].should.eql({
        code: 'en',
        region: undefined,
        quality: 0.4
      });

      request.pre.language[4].should.eql({
        code: '*',
        region: undefined,
        quality: 0.1
      });

      done();
    }});
  });

  it('should ignore a malformed header', function(done){
    var request = {
      pre: {},
      raw: {
        req: {
          headers: {
            'accept-language:': 'doijge5otu gije5 ueorjseo9u dkfvj oe5ugoidv oe49g'
          }
        }
      },
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){
      request.pre.language.length.should.eql(0);
      done();
    }});
  });

});
