<template>
  <div>
    <Head :title="title" :type="datacenter"></Head>
    <div class="top">
      <div class="top_img">
        <img src="../../assets/icon-first/tx.png" />
      </div>
      <div class="top_text">你已完成{{this.rz_num}}项认证</div>
    </div>
    <div class="my-content">
      <div class="my-content-area-face credit">
        <div class="content-a">
          <img src="../../assets/icon-first/zhima_zredit.png" />
        </div>
        <div class="content-b">
          <p>芝麻授信</p>
          <p>授信后最高可提额2000元</p>
        </div>
        <div class="content-c">免认证</div>
      </div>
      <div class="my-content-area-face face" @click="humanface">
        <div class="content-a">
          <img src="../../assets/icon-first/sfz.png" />
        </div>
        <div class="content-b">
          <p>实名认证</p>
          <p>身份证和其他证件认证</p>
        </div>
        <div class="content-c">
          <!-- <span v-if="truncate.borrowCart==='0'">未认证</span>
          <span v-else-if="truncate.borrowCart === '1'">已认证</span>-->
          <span>{{truncate.borrowCart=="1"?"已认证" :'未认证'}}</span>
        </div>
      </div>
      <div class="my-content-area-face personage" @click="personage">
        <div class="content-a">
          <img src="../../assets/icon-first/txl.png" />
        </div>
        <div class="content-b">
          <p>通讯录认证</p>
          <p>防范他人操作，防止账号冒用</p>
        </div>
        <div class="content-c">
          <!-- <span v-if="truncate.borrowMsg==='0'">未填写</span>
          <span v-else-if="truncate.borrowMsg === '1'">已填写</span>-->
          <span>{{truncate.borrowMsg=="1"?"已填写" :'未填写'}}</span>
        </div>
      </div>

      <div class="my-content-area-face bankcard" @click="bindbankcard">
        <div class="content-a">
          <img src="../../assets/icon-first/yhk.png" />
        </div>
        <div class="content-b">
          <p>收款银行卡</p>
          <p>提供收款银行卡账户</p>
        </div>
        <div class="content-c">
          <!-- <span v-if="truncate.bindCard==='0'">未认证</span>
          <span v-else-if="truncate.bindCard === '1'">已认证</span>-->
          <span>{{truncate.bindCard=="1"?"已认证" :'未认证'}}</span>
        </div>
      </div>

      <div class="my-content-area-face phone" @click="operator">
        <div class="content-a">
          <img src="../../assets/icon-first/yys.png" />
        </div>
        <div class="content-b">
          <p>运营商认证</p>
          <p>提高下款通过率</p>
        </div>
        <div class="content-c">
          <!-- <span v-if="truncate.operators==='0'">未认证</span>
          <span v-else-if="truncate.operators === '1'">已认证</span>-->
          <span>{{truncate.operators=="1"?"已认证" :'未认证'}}</span>
        </div>
      </div>
      <p class="submitBtn" @click="submit" v-if="way">点击申请</p>
    </div>
    
  </div>
</template>
<script>
import Head from "../../components/head";
import {
  getOrderAuth,
  saveBinfo,
  saveAuthInfo,
  getAccount,
  qzIsGetYysData,
  carrier
} from "../../api/app.api";

export default {
  name: "datacenter",
  components: {
    Head
  },
  data() {
    return {
      type: "datacenter",
      title: "认证资料",
      isBack: "",
      userInfo: "",
      truncate: "",
      token: "",
      rz_num: 1,
      way: true,
      datacenter: ""
    };
  },
  methods: {
    Totas: function() {
      this.toast = this.$createToast({
        txt: this.text,
        type: "txt",

        time: 1000
      });
      this.toast.show();
    },
    operator: function() {
      if (this.truncate.borrowCart == 0) {
        this.text = "请先人脸认证";
        this.Totas();
        return false;
      } else if (this.truncate.borrowMsg == 0) {
        this.text = "请先填写个人资料";
        this.Totas();
        return false;
      } else if (this.truncate.bindCard == 0) {
        this.text = "请先填写银行卡信息";
        this.Totas();
        return false;
      } else if (this.truncate.operators == 0) {
        let toOperator = {
          orderId: this.truncate.orderId,
          uid: this.userInfo.id,
          phone: this.truncate.phone,
          token: this.token
        };
        // dsBridge.call("toOperator", toOperator, function(v) {});
        carrier({
        },{
          token:this.token
        })
        .then(res => {
          if (res.code=="200") {
            window.location.href = res.data;
          }else{
            this.text = res.msg;
            this.Totas();
          }
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.text = "已验证";
        this.Totas();
      }
    },
    //获取
    getNum: function() {
      if (this.truncate.borrowCart == 1) {
        this.rz_num++;
      }
      if (this.truncate.borrowMsg == 1) {
        this.rz_num++;
      }
      if (this.truncate.bindCard == 1) {
        this.rz_num++;
      }
      if (this.truncate.operators == 1) {
        this.rz_num++;
      }
      if (this.rz_num >= 5) {
        this.rz_num = 5;
      }
    },
    //人脸
    humanface: function() {
      if (this.truncate.borrowCart == 0) {
        this.$router.push({ name: "idCard" });
        // getAccount({
        //   orderId: this.truncate.orderId
        // })
        //   .then(res => {
        //     if (res.result) {
        //       let xinyanOCR = {
        //         memberId: res.result.memberId,
        //         terminalId: res.result.terminalId,
        //         transId: res.result.transId,
        //         orderId: this.truncate.orderId,
        //         uid: this.userInfo.id
        //       };
        //       this.$router.push({ name: "idCard" });
        //       // dsBridge.call("xinyanOCR", xinyanOCR, function(v) {
        //       //   alert(JSON.parse(v));
        //       // });
        //     }
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
      } else {
        this.text = "已验证";
        this.Totas();
      }
    },
    //通讯录
    submit: function() {
      var status = this.$route.query.status;
      if (this.truncate.borrowCart == 0) {
        //未实名认证;
        this.text = "未实名认证,请先认证";
        this.Totas();
      } else if (this.truncate.borrowMsg == 0) {
        //其他联系人
        this.text = "未填写联系人,请先填写";
        this.Totas();
      } else if (this.truncate.bindCard == 0) {
        //未填写卡号
        this.text = "未填写银行卡号,请先填写";
        this.Totas();
      } else if (this.truncate.operators == 0) {
        //未验证手机运营商
        this.text = "未验证手机运营商,请先填写";
        this.Totas();
      } else if (status == 6) {
        //申请未通过
        this.text = "申请未通过";
        this.Totas();
      } else {
        this.$router.push({ name: "borrowing" });
        return false;
      }
    },

    //运营商验证
    qzIsGetYys: function() {
      qzIsGetYysData({
        orderId: this.truncate.orderId,
        
      })
        .then(res => {
          if (res.code == "000") {
            this.$set(this.truncate, "operators", "1");
            this.getNum();
          } else {
            this.text = "认证失败，请重试";
            this.Totas();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //银行卡认证
    bindbankcard: function() {
      if (this.truncate.borrowCart == 0) {
        this.text = "请先人脸认证";
        this.Totas();
        return false;
      } else if (this.truncate.borrowMsg == 0) {
        this.text = "请先填写个人资料";
        this.Totas();
        return false;
      } else if (this.truncate.bindCard == 0) {
        this.$router.push({
          name: "bindbankcard",
          query: { md: "rem" }
        });
      } else {
        this.text = "已验证";
        this.Totas();
      }
    },
    personage: function() {
      if (this.truncate.borrowCart == 0) {
        this.text = "请先人脸认证";
        this.Totas();
        return false;
      } else if (this.truncate.borrowMsg == 0) {
        this.$router.push({
          name: "personage",
          query: { orderId: this.truncate.orderId }
        });
      } else {
        this.text = "已验证";
        this.Totas();
      }
    },
    tpageToken: function() {
      saveBinfo(
        {
          productType:this.utils.fetch("ptermType"),
          expectMoney:3000,
        },
        {
          token: this.token
        }
      )
      .then(res => {
        if (res.code=="200") {
          getOrderAuth({},{
            token: this.token
          })
            .then(res => {
              if (res.data) {
                this.truncate = res.data;
                this.getNum();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }else if(res.code=="301"){
          this.$router.push({ name: "Login" });
        }else{
          this.text = res.msg;
          this.Totas();
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  mounted() {
    this.datacenter = this.$route.query.way;
    if (this.$route.query.way) {
      this.way = false;
    }
    this.userinfo = this.utils.fetch("userInfo");
    this.token = this.utils.fetch("token");

    let _this = this;
    dsBridge.register("humanfacecallback", function(l) {
      var l = JSON.parse(l);
      _this.$set(_this.truncate, "borrowCart", l.type);
      _this.getNum();
    });
    //运营商
    dsBridge.register("operatorcallback", function(l) {
      var l = JSON.parse(l);

      _this.qzIsGetYys(l);
      _this.getNum();
    });
    var token = (this.token = this.utils.fetch("token"));

    if (token.length == 0) {
      this.user = true;
      this.$router.push({ name: "Login" });
    } else {
      this.utils.save("type", this.type);
      this.userInfo = this.utils.fetch("userInfo");
      this.tpageToken();
    }
  },
  destroyed() {
    clearInterval(this.intervalid2);
  }
};
</script>
<style lang='scss' scoped>
@import "./index.scss";
</style>