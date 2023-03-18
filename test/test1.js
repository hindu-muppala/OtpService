let chai=require("chai");
const assert=chai.assert;
let chaiHttp=require('chai-http');
let server=require('../index2')
var expect = chai.expect;
chai.use(chaiHttp)
describe('Otp Service', ()=>{
    it('get', function() {   
        chai.request(server)
        .get('/verifyOtp')
        .responseType('json')
        .end(function(err, res) {
          expect(res).to.have.status(404);    
        });
      });
      it('post',function(){
        chai.request(server)
        .post('/otp')
        .responseType('json')
        .end(function(err,res){
          expect(res).to.have.status(404);
        })
      })
});
