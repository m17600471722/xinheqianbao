<template>
  <div>
   <div class="logIn-loading" v-if="loading">
      <cube-loading :size="30"></cube-loading>
    </div>
    <Head :title="title" :isBack="isBack"></Head>
    <div class="exten">
      <div class="exten_list">
        <div class="extenli">
          <span>借款天数(天)：</span>
          <span class="textval">{{result.loanTerm}}</span>
        </div>
        <div class="extenli">
          <span>应还款日：</span>
          <span class="textval">{{result.shouldRepayDate}}</span>
        </div>
        <div class="extenli">
          <span>到账金额(元)：</span>
          <span class="textval">{{parseFloat(result.inAccount).toFixed(2)}}</span>
        </div>
        <div class="extenli">
          <span>服务费用(元)：</span>
          <span class="textval">{{parseFloat(result.serviceAmount).toFixed(2)}}</span>
        </div>
        <div class="extenli">
          <span>利息(元)：</span>
          <span class="textval">{{parseFloat(result.shouldRepayInterest).toFixed(2)}}</span>
        </div>
        <div class="extenli">
          <span>逾期费用(元)：</span>
          <span class="textval">{{parseFloat(result.overdueFee).toFixed(2)}}</span>
        </div>
        <div class="extenli">
          <span class="texttitle">总费用(元)：</span>
          <span class="textval textcolor">{{parseFloat(result.shouldRepayTotal).toFixed(2)}}</span>
        </div>
        <div class="content-area" v-if="hasSendValidCode==1">
          <div class="text">验证码</div>
          <div class="input">
            <cube-input
              v-model="code"
              placeholder="请输入验证码"
              :type="directline.type"
              :maxlength="directline.maxlength2"
            ></cube-input>
          </div>
          <div class="verificationcode verificationcode2">
            <span @click="getVerification">{{verificationText}}</span>
          </div>
        </div>
      </div>
      <p class="tipText">*申请还款展期需要先支付总服务费，展期方可生效。</p>
      <div class="repaybtn">
        <cube-button class="loan_btn extension_btn"  @click="repayClick">立即支付</cube-button>
      </div>
    </div>
  </div>
</template>
<script>
import Head from "../../components/head";
import { getCardSms,repayment,saveCard,getCardInfo,repaymentSendSms,borrowrepayInfo } from "../../api/app.api";
import { provinceList } from "../../api/area";

export default {
  name: "extension",
  components: {
    Head
  },
  data() {
    return {
      type: "extension",
      title: "还款详情",
      isBack: "",
      token: "",
      loading:false,
      userInfo:"",
      result:{},
      repaySuccess:false,
      toast:null,
      validCode:"",
      directline: {
        relation: "",
        type: "text",
        maxlength: 100,
        maxlength2: 6,
        disabled: true
      },
      verificationText: "获取验证码",
      hasSendValidCode:"",
      code:"",
      isCode: true, //验证码是否可点击状态
    };
  },
  methods: {
    repayClick: function() {
      let payData = {
        type: 1,
      }
      if(this.hasSendValidCode == 1){
        if(this.code==""){
          this.text = "请输入验证码";
          this.Totas();
          return
        }else{
          payData.validCode = this.code
        }
      }
      this.Pay(payData);
    },
    //还款
    Pay(payData){
      this.$createDialog({
        type: "confirm",
        content: "是否确认还款",
        confirmBtn: {
          text: "确定还款",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "暂时不还",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
          this.loading = true;
          repayment(payData,{
            token:this.token
          })
          .then(res => {
            this.loading = false;
            if (res.code == "200") {
              this.text = "还款成功";
              this.repaySuccess=true;
              this.Totas();
            }else if(res.code == "606"){
              window.location.href = res.data
            } else{
              this.text = res.msg;
              this.repaySuccess = false;
              this.Totas();
            }
          })
          .catch(error => {
            this.loading = false;
          });
        },
        onCancel: () => {
          return false;
        }
      }).show();


      
    },
    Totas: function() {
      this.toast = this.$createToast({
        txt: this.text,
        type: "txt",
        time: 1000,
        onTimeout: () => {
          if (this.repaySuccess) {
            this.$router.push({ name: "home" });
          }
        }
      });
      this.toast.show();
    },
    getEstensionInfo:function(){
      borrowrepayInfo({
        type:1
      },{
        token:this.token
      })
      .then(res=>{
        if(res.code=="200"){
          this.result = res.data;
        }
      })
    },
    //获取验证码
    getVerification: function() {
      if (!this.isCode) {
        return;
      }
      this.loading = true;
      repaymentSendSms({
        type: 1,
      },{
        token:this.token
      })
      .then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.text = "验证码发送成功";
          this.countTime();
        } else {
          this.text = res.msg;
        }
        this.Totas();
      })
      .catch(error => {
        console.log(error);
      });
    },
    //验证码的倒计时
    countTime: function() {
      let i = 59;
      this.isCode = false;
      this.verificationText = "59s";
      this.time = setInterval(() => {
        i--;
        this.verificationText = i + "s";
        if (i == 0) {
          this.verificationText = "获取验证码";
          this.Sms = "";
          this.isCode = true;
          clearInterval(this.time);
        }
      }, 1000);
    },
  },
  
  mounted() {
    this.hasSendValidCode = this.$route.query.hasSendValidCode;
    this.utils.save("type", this.type);
    this.token = this.utils.fetch("token");
    this.userInfo = this.utils.fetch("userInfo");
    this.getEstensionInfo();
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>