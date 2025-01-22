"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[15],{6753:function(t,e,s){s.r(e),s.d(e,{default:function(){return X}});var i=s(2781),r=s(375),n=s(7210),o=s(8834),a=(s(5601),s(7889)),l=s(3960),c=s(4680),h=c.A.extend({name:"v-checkbox",props:{indeterminate:Boolean,indeterminateIcon:{type:String,default:"$checkboxIndeterminate"},offIcon:{type:String,default:"$checkboxOff"},onIcon:{type:String,default:"$checkboxOn"}},data(){return{inputIndeterminate:this.indeterminate}},computed:{classes(){return{...l.A.options.computed.classes.call(this),"v-input--selection-controls":!0,"v-input--checkbox":!0,"v-input--indeterminate":this.inputIndeterminate}},computedIcon(){return this.inputIndeterminate?this.indeterminateIcon:this.isActive?this.onIcon:this.offIcon},validationState(){if(!this.isDisabled||this.inputIndeterminate)return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0}},watch:{indeterminate(t){this.$nextTick((()=>this.inputIndeterminate=t))},inputIndeterminate(t){this.$emit("update:indeterminate",t)},isActive(){this.indeterminate&&(this.inputIndeterminate=!1)}},methods:{genCheckbox(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(a.A,this.setTextColor(this.validationState,{props:{dense:this.dense,dark:this.dark,light:this.light}}),this.computedIcon),this.genInput("checkbox",{...e,"aria-checked":this.inputIndeterminate?"mixed":this.isActive.toString()}),this.genRipple(this.setTextColor(this.rippleState))])},genDefaultSlot(){return[this.genCheckbox(),this.genLabel()]}}}),u=s(1526),d=s(6278),p=s(4155),m=s(1770),v=s(8230),f=s(9456),g=s(2987),y=s(1075),A=s(3422),b=s(8412),C=s(1556),$=s(7410),w=(s(4114),s(7495)),k=s(8652),S=s(4464),_=s(3507),x=s(5604),D=s(6960);const I=(0,_.A)(w.A,(0,k.G)("stepper"),S.A);var B=I.extend({name:"v-stepper",provide(){return{stepClick:this.stepClick,isVertical:this.vertical}},props:{altLabels:Boolean,nonLinear:Boolean,flat:Boolean,vertical:Boolean},data(){const t={isBooted:!1,steps:[],content:[],isReverse:!1};return t.internalLazyValue=null!=this.value?this.value:(t[0]||{}).step||1,t},computed:{classes(){return{"v-stepper--flat":this.flat,"v-stepper--is-booted":this.isBooted,"v-stepper--vertical":this.vertical,"v-stepper--alt-labels":this.altLabels,"v-stepper--non-linear":this.nonLinear,...w.A.options.computed.classes.call(this)}},styles(){return{...w.A.options.computed.styles.call(this)}}},watch:{internalValue(t,e){this.isReverse=Number(t)<Number(e),e&&(this.isBooted=!0),this.updateView()}},created(){this.$listeners.input&&(0,x.q4)("@input","@change",this)},mounted(){this.updateView()},methods:{register(t){"v-stepper-step"===t.$options.name?this.steps.push(t):"v-stepper-content"===t.$options.name&&(t.isVertical=this.vertical,this.content.push(t))},unregister(t){"v-stepper-step"===t.$options.name?this.steps=this.steps.filter((e=>e!==t)):"v-stepper-content"===t.$options.name&&(t.isVertical=this.vertical,this.content=this.content.filter((e=>e!==t)))},stepClick(t){this.$nextTick((()=>this.internalValue=t))},updateView(){for(let t=this.steps.length;--t>=0;)this.steps[t].toggle(this.internalValue);for(let t=this.content.length;--t>=0;)this.content[t].toggle(this.internalValue,this.isReverse)}},render(t){return t(this.tag,{staticClass:"v-stepper",class:this.classes,style:this.styles},(0,D.$c)(this))}}),E=s(1906);const T=(0,_.A)((0,k.W)("stepper","v-stepper-content","v-stepper"));var N=T.extend().extend({name:"v-stepper-content",inject:{isVerticalProvided:{from:"isVertical"}},props:{step:{type:[Number,String],required:!0}},data(){return{height:0,isActive:null,isReverse:!1,isVertical:this.isVerticalProvided}},computed:{computedTransition(){const t=this.$vuetify.rtl?!this.isReverse:this.isReverse;return t?E.P1:E.Dk},styles(){return this.isVertical?{height:(0,D.Dg)(this.height)}:{}}},watch:{isActive(t,e){t&&null==e?this.height="auto":this.isVertical&&(this.isActive?this.enter():this.leave())}},mounted(){this.$refs.wrapper.addEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.register(this)},beforeDestroy(){this.$refs.wrapper.removeEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.unregister(this)},methods:{onTransition(t){this.isActive&&"height"===t.propertyName&&(this.height="auto")},enter(){let t=0;requestAnimationFrame((()=>{t=this.$refs.wrapper.scrollHeight})),this.height=0,setTimeout((()=>this.isActive&&(this.height=t||"auto")),450)},leave(){this.height=this.$refs.wrapper.clientHeight,setTimeout((()=>this.height=0),10)},toggle(t,e){this.isActive=t.toString()===this.step.toString(),this.isReverse=e}},render(t){const e={staticClass:"v-stepper__content"},s={staticClass:"v-stepper__wrapper",style:this.styles,ref:"wrapper"};this.isVertical||(e.directives=[{name:"show",value:this.isActive}]);const i=t("div",s,(0,D.$c)(this)),r=t("div",e,[i]);return t(this.computedTransition,{on:this.$listeners},[r])}}),O=s(8767),V=s(1723);const q=(0,_.A)(O.A,(0,k.W)("stepper","v-stepper-step","v-stepper"));var P=q.extend().extend({name:"v-stepper-step",directives:{ripple:V.A},inject:["stepClick"],props:{color:{type:String,default:"primary"},complete:Boolean,completeIcon:{type:String,default:"$complete"},editable:Boolean,editIcon:{type:String,default:"$edit"},errorIcon:{type:String,default:"$error"},rules:{type:Array,default:()=>[]},step:[Number,String]},data(){return{isActive:!1,isInactive:!0}},computed:{classes(){return{"v-stepper__step--active":this.isActive,"v-stepper__step--editable":this.editable,"v-stepper__step--inactive":this.isInactive,"v-stepper__step--error error--text":this.hasError,"v-stepper__step--complete":this.complete}},hasError(){return this.rules.some((t=>!0!==t()))}},mounted(){this.stepper&&this.stepper.register(this)},beforeDestroy(){this.stepper&&this.stepper.unregister(this)},methods:{click(t){t.stopPropagation(),this.$emit("click",t),this.editable&&this.stepClick(this.step)},genIcon(t){return this.$createElement(a.A,t)},genLabel(){return this.$createElement("div",{staticClass:"v-stepper__label"},(0,D.$c)(this))},genStep(){const t=!(this.hasError||!this.complete&&!this.isActive)&&this.color;return this.$createElement("span",this.setBackgroundColor(t,{staticClass:"v-stepper__step__step"}),this.genStepContent())},genStepContent(){const t=[];return this.hasError?t.push(this.genIcon(this.errorIcon)):this.complete?this.editable?t.push(this.genIcon(this.editIcon)):t.push(this.genIcon(this.completeIcon)):t.push(String(this.step)),t},keyboardClick(t){t.keyCode===D.uP.space&&this.click(t)},toggle(t){this.isActive=t.toString()===this.step.toString(),this.isInactive=Number(t)<Number(this.step)}},render(t){return t("div",{attrs:{tabindex:this.editable?0:-1},staticClass:"v-stepper__step",class:this.classes,directives:[{name:"ripple",value:this.editable}],on:{click:this.click,keydown:this.keyboardClick}},[this.genStep(),this.genLabel()])}});const L=(0,D.Gn)("v-stepper__header"),R=(0,D.Gn)("v-stepper__items");var F=s(2006),j=s(9940),z=s(7402),H=function(){var t=this,e=t._self._c;return e(d.A,{staticClass:"py-8"},[e(b.A,{attrs:{justify:"center"}},[e(u.A,{attrs:{cols:"12",md:"8"}},[e(n.A,{staticClass:"request-card"},[e(o.ri,{staticClass:"text-h4 text-center d-block py-6"},[t._v(" Document Request Form ")]),e(o.OQ,[e(B,{model:{value:t.currentStep,callback:function(e){t.currentStep=e},expression:"currentStep"}},[e(L,[e(P,{attrs:{complete:t.currentStep>1,step:"1"}},[t._v(" Personal Information ")]),e(m.A),e(P,{attrs:{complete:t.currentStep>2,step:"2"}},[t._v(" Document Details ")]),e(m.A),e(P,{attrs:{step:"3"}},[t._v("Review & Submit")])],1),e(R,[e(N,{attrs:{step:"1"}},[e(v.A,{ref:"personalForm",staticClass:"mt-2",model:{value:t.forms.personal.valid,callback:function(e){t.$set(t.forms.personal,"valid",e)},expression:"forms.personal.valid"}},[e(b.A,[e(u.A,{attrs:{cols:"12",md:"6"}},[e(j.A,{attrs:{label:"Full Name",rules:t.rules.required,outlined:"",dense:""},model:{value:t.formData.fullName,callback:function(e){t.$set(t.formData,"fullName",e)},expression:"formData.fullName"}})],1),e(u.A,{attrs:{cols:"12",md:"6"}},[e(j.A,{attrs:{label:"Student ID",outlined:"",dense:""},model:{value:t.formData.studentId,callback:function(e){t.$set(t.formData,"studentId",e)},expression:"formData.studentId"}})],1),e(u.A,{attrs:{cols:"12",md:"6"}},[e(j.A,{attrs:{label:"Email",rules:t.rules.email,outlined:"",dense:""},model:{value:t.formData.email,callback:function(e){t.$set(t.formData,"email",e)},expression:"formData.email"}})],1),e(u.A,{attrs:{cols:"12",md:"6"}},[e(j.A,{attrs:{label:"Contact Phone",rules:t.rules.required,outlined:"",dense:""},model:{value:t.formData.phone,callback:function(e){t.$set(t.formData,"phone",e)},expression:"formData.phone"}})],1)],1),e(r.A,{attrs:{color:"primary",disabled:!t.forms.personal.valid},on:{click:function(e){return t.nextStep(1)}}},[t._v(" Continue ")])],1)],1),e(N,{attrs:{step:"2"}},[e(v.A,{ref:"documentForm",model:{value:t.forms.document.valid,callback:function(e){t.$set(t.forms.document,"valid",e)},expression:"forms.document.valid"}},[e(b.A,[e(u.A,{attrs:{cols:"12"}},[e(n.A,{staticClass:"pa-4",attrs:{outlined:""}},[e(F.A,{staticClass:"pl-0 text-h6"},[t._v("Document Type (Select all that apply)")]),e(b.A,t._l(t.documentTypes,(function(s){return e(u.A,{key:s,attrs:{cols:"12",md:"6"}},[e(h,{staticClass:"mb-2",attrs:{label:s,value:s,dense:"","hide-details":""},model:{value:t.formData.requestedDocuments,callback:function(e){t.$set(t.formData,"requestedDocuments",e)},expression:"formData.requestedDocuments"}})],1)})),1),e(b.A,[e(u.A,{attrs:{cols:"12",md:"6"}},[t.formData.requestedDocuments.includes("Others")?e(j.A,{attrs:{label:"Please specify other document type",rules:t.rules.required,outlined:"",dense:""},model:{value:t.formData.otherDocumentType,callback:function(e){t.$set(t.formData,"otherDocumentType",e)},expression:"formData.otherDocumentType"}}):t._e()],1)],1),0===t.formData.requestedDocuments.length?e(i.A,{staticClass:"mt-2",attrs:{type:"warning",dense:"",text:""}},[t._v(" Please select at least one document type ")]):t._e()],1)],1),e(u.A,{attrs:{cols:"12",md:"6"}},[e(C.A,{attrs:{items:t.purposes,label:"Purpose",rules:t.rules.required,outlined:"",dense:""},model:{value:t.formData.purpose,callback:function(e){t.$set(t.formData,"purpose",e)},expression:"formData.purpose"}})],1),e(u.A,{attrs:{cols:"12",md:"6"}},["Others"===t.formData.purpose?e(j.A,{attrs:{label:"Please specify other purpose",rules:t.rules.required,outlined:"",dense:""},model:{value:t.formData.otherPurpose,callback:function(e){t.$set(t.formData,"otherPurpose",e)},expression:"formData.otherPurpose"}}):t._e()],1),e(u.A,{attrs:{cols:"12",md:"12"}},[e(z.A,{attrs:{label:"Additional Notes",outlined:"",dense:"",placeholder:"Enter any additional information or special requirements",rows:"2"},model:{value:t.formData.notes,callback:function(e){t.$set(t.formData,"notes",e)},expression:"formData.notes"}})],1)],1),e(r.A,{attrs:{text:""},on:{click:function(e){t.currentStep=1}}},[t._v("Back")]),e(r.A,{staticClass:"ml-4",attrs:{color:"primary",disabled:!t.forms.document.valid},on:{click:function(e){return t.nextStep(2)}}},[t._v(" Continue ")])],1)],1),e(N,{attrs:{step:"3"}},[e(n.A,{attrs:{flat:""}},[e(o.OQ,[e("h3",{staticClass:"text-h6 mb-4"},[t._v("Review Your Request")]),e(g.A,{attrs:{dense:""}},[e(F.A,{staticClass:"pl-0"},[t._v("Personal Information")]),t._l(t.personalInfoReview,(function(s,i){return e(y.A,{key:i},[e(A.pr,[e(A.w,{staticClass:"text-capitalize"},[t._v(" "+t._s(i.replace("_"," "))+" ")]),e(A.UZ,[t._v(t._s(s))])],1)],1)})),e(m.A,{staticClass:"my-4"}),e(F.A,{staticClass:"pl-0"},[t._v("Document Details")]),t._l(t.documentDetailsReview,(function(s,i){return e(y.A,{key:i},[e(A.pr,[e(A.w,{staticClass:"text-capitalize"},[t._v(" "+t._s(i.replace("_"," "))+" ")]),e(A.UZ,[t._v(t._s(s))])],1)],1)}))],2)],1)],1),e(r.A,{staticClass:"mt-4",attrs:{text:""},on:{click:function(e){t.currentStep=2}}},[t._v(" Back ")]),e(r.A,{staticClass:"mt-4 ml-4",attrs:{color:"primary",loading:t.loading},on:{click:t.submitRequest}},[t._v(" Submit Request ")])],1)],1)],1),e(p.A,{attrs:{"max-width":"400",persistent:""},model:{value:t.showSuccessDialog,callback:function(e){t.showSuccessDialog=e},expression:"showSuccessDialog"}},[e(n.A,[e(o.ri,{staticClass:"text-h5 text-center"},[t._v(" Request Submitted Successfully ")]),e(o.OQ,{staticClass:"text-center"},[e(f.A,{staticClass:"mb-4",attrs:{color:"success","x-large":""}},[t._v(" mdi-check-circle ")]),e("p",{staticClass:"mb-4"},[t._v("Your tracking number is:")]),e("p",{staticClass:"text-h6"},[t._v(t._s(t.trackingNumber))]),e("p",{staticClass:"caption mt-4"},[t._v(" Please save this number to track your request status ")])],1),e(o.SL,[e($.A),e(r.A,{attrs:{color:"primary",text:""},on:{click:t.goToTracking}},[t._v(" Track Request ")]),e(r.A,{attrs:{color:"primary"},on:{click:t.resetForm}},[t._v(" Done ")])],1)],1)],1)],1)],1)],1)],1)],1)},G=[],W=s(5353),Z={name:"DocumentRequestPage",data:()=>({currentStep:1,loading:!1,showSuccessDialog:!1,trackingNumber:"",forms:{personal:{valid:!1},document:{valid:!1}},formData:{fullName:"",studentId:"",email:"",phone:"",purpose:"",notes:"",requestedDocuments:[],status:"pending",statusHistory:[{status:"pending",notes:"Initial request submitted",timestamp:new Date}],trackingNumber:""},rules:{required:[t=>!!t||"This field is required"],email:[t=>!!t||"Email is required",t=>/.+@.+\..+/.test(t)||"Email must be valid"]},documentTypes:["Transcript of Records","Diploma","Certification of Graduation","Certificate of Good Moral Character","Year Book","Form 137","Certificate of Enrollment","Course Description","Certified True Copy","Others"],purposes:["Employment","Further Education","Scholarship Application","Personal Records","Others"]}),computed:{personalInfoReview(){return{full_name:this.formData.fullName,student_id:this.formData.studentId,email:this.formData.email,phone:this.formData.phone}},documentDetailsReview(){return{document_types:this.formData.requestedDocuments.join(", "),purpose:this.formData.purpose,additional_notes:this.formData.notes||"None"}}},methods:{...(0,W.i0)("documentRequest",["createRequest"]),nextStep(t){1===t&&this.$refs.personalForm.validate()?this.currentStep=2:2===t&&this.$refs.documentForm.validate()&&this.formData.requestedDocuments.length>0&&(this.currentStep=3)},async submitRequest(){this.loading=!0;try{const t=await this.createRequest(this.formData);this.trackingNumber=t.trackingNumber,this.showSuccessDialog=!0,this.$store.commit("SET_SNACKBAR",{show:!0,text:"Document request submitted successfully!",color:"success"})}catch(t){this.$store.commit("SET_SNACKBAR",{show:!0,text:t.response?.data?.message||"Failed to submit request",color:"error"})}finally{this.loading=!1}},goToTracking(){this.$router.push({name:"TrackRequest",query:{tracking:this.trackingNumber}})},resetForm(){this.showSuccessDialog=!1,this.currentStep=1,this.$refs.personalForm.reset(),this.$refs.documentForm.reset(),this.formData={fullName:"",studentId:"",email:"",phone:"",documentType:"",purpose:"",notes:"",otherDocumentType:"",otherPurpose:""}}},mounted(){const t=this.$route.params.prefilledData;t&&(this.formData={...this.formData,...t})}},M=Z,K=s(1656),Y=(0,K.A)(M,H,G,!1,null,"4a5631db",null),X=Y.exports},158:function(){},5601:function(){},2781:function(t,e,s){s.d(e,{A:function(){return p}});var i=s(7495),r=s(3536),n=s(7889),o=s(9748),a=s(3661),l=s(5471),c=l.Ay.extend({name:"transitionable",props:{mode:String,origin:String,transition:String}}),h=s(3507),u=s(5604),d=s(6960),p=(0,h.A)(i.A,o.A,c).extend({name:"v-alert",props:{border:{type:String,validator(t){return["top","right","bottom","left"].includes(t)}},closeLabel:{type:String,default:"$vuetify.close"},coloredBorder:Boolean,dense:Boolean,dismissible:Boolean,closeIcon:{type:String,default:"$cancel"},icon:{default:"",type:[Boolean,String],validator(t){return"string"===typeof t||!1===t}},outlined:Boolean,prominent:Boolean,text:Boolean,type:{type:String,validator(t){return["info","error","success","warning"].includes(t)}},value:{type:Boolean,default:!0}},computed:{__cachedBorder(){if(!this.border)return null;let t={staticClass:"v-alert__border",class:{[`v-alert__border--${this.border}`]:!0}};return this.coloredBorder&&(t=this.setBackgroundColor(this.computedColor,t),t.class["v-alert__border--has-color"]=!0),this.$createElement("div",t)},__cachedDismissible(){if(!this.dismissible)return null;const t=this.iconColor;return this.$createElement(r.A,{staticClass:"v-alert__dismissible",props:{color:t,icon:!0,small:!0},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:()=>this.isActive=!1}},[this.$createElement(n.A,{props:{color:t}},this.closeIcon)])},__cachedIcon(){return this.computedIcon?this.$createElement(n.A,{staticClass:"v-alert__icon",props:{color:this.iconColor}},this.computedIcon):null},classes(){const t={...i.A.options.computed.classes.call(this),"v-alert--border":Boolean(this.border),"v-alert--dense":this.dense,"v-alert--outlined":this.outlined,"v-alert--prominent":this.prominent,"v-alert--text":this.text};return this.border&&(t[`v-alert--border-${this.border}`]=!0),t},computedColor(){return this.color||this.type},computedIcon(){return!1!==this.icon&&("string"===typeof this.icon&&this.icon?this.icon:!!["error","info","success","warning"].includes(this.type)&&`$${this.type}`)},hasColoredIcon(){return this.hasText||Boolean(this.border)&&this.coloredBorder},hasText(){return this.text||this.outlined},iconColor(){return this.hasColoredIcon?this.computedColor:void 0},isDark(){return!(!this.type||this.coloredBorder||this.outlined)||a.A.options.computed.isDark.call(this)}},created(){this.$attrs.hasOwnProperty("outline")&&(0,u.q4)("outline","outlined",this)},methods:{genWrapper(){const t=[(0,d.$c)(this,"prepend")||this.__cachedIcon,this.genContent(),this.__cachedBorder,(0,d.$c)(this,"append"),this.$scopedSlots.close?this.$scopedSlots.close({toggle:this.toggle}):this.__cachedDismissible],e={staticClass:"v-alert__wrapper"};return this.$createElement("div",e,t)},genContent(){return this.$createElement("div",{staticClass:"v-alert__content"},(0,d.$c)(this))},genAlert(){let t={staticClass:"v-alert",attrs:{role:"alert"},on:this.listeners$,class:this.classes,style:this.styles,directives:[{name:"show",value:this.isActive}]};if(!this.coloredBorder){const e=this.hasText?this.setTextColor:this.setBackgroundColor;t=e(this.computedColor,t)}return this.$createElement("div",t,[this.genWrapper()])},toggle(){this.isActive=!this.isActive}},render(t){const e=this.genAlert();return this.transition?t("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[e]):e}})},3536:function(t,e,s){var i=s(375);e.A=i.A},4155:function(t,e,s){s.d(e,{A:function(){return v}});var i=s(9084),r=s(4462),n=s(9623),o=s(103),a=s(123),l=s(326),c=s(7768),h=s(8734),u=s(3507),d=s(5604),p=s(6960);const m=(0,u.A)(n.A,o.A,a.A,l.A,c.A,r.A);var v=m.extend({name:"v-dialog",directives:{ClickOutside:h.A},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:[String,Number],noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:[String,Number]},data(){return{activatedBy:null,animate:!1,animateTimeout:-1,stackMinZIndex:200,previousActiveElement:null}},computed:{classes(){return{[`v-dialog ${this.contentClass}`.trim()]:!0,"v-dialog--active":this.isActive,"v-dialog--persistent":this.persistent,"v-dialog--fullscreen":this.fullscreen,"v-dialog--scrollable":this.scrollable,"v-dialog--animated":this.animate}},contentClasses(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null===(e=this.previousActiveElement)||void 0===e||e.focus())},fullscreen(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created(){this.$attrs.hasOwnProperty("full-width")&&(0,d.rq)("full-width",this)},beforeMount(){this.$nextTick((()=>{this.isBooted=this.isActive,this.isActive&&this.show()}))},beforeDestroy(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick(){this.animate=!1,this.$nextTick((()=>{this.animate=!0,window.clearTimeout(this.animateTimeout),this.animateTimeout=window.setTimeout((()=>this.animate=!1),150)}))},closeConditional(t){const e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):a.A.options.methods.hideScroll.call(this)},show(){!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((()=>{this.$nextTick((()=>{var t,e;(null===(t=this.$refs.dialog)||void 0===t?void 0:t.contains(document.activeElement))||(this.previousActiveElement=document.activeElement,null===(e=this.$refs.dialog)||void 0===e||e.focus()),this.bind()}))}))},bind(){window.addEventListener("focusin",this.onFocusin)},unbind(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown(t){if(t.keyCode===p.uP.esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;const t=this.getActivator();this.$nextTick((()=>t&&t.focus()))}this.$emit("keydown",t)},onFocusin(t){if(!t||!this.retainFocus)return;const e=t.target;if(e&&this.$refs.dialog&&![document,this.$refs.dialog].includes(e)&&!this.$refs.dialog.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((t=>t.contains(e)))){const t=this.$refs.dialog.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'),e=[...t].find((t=>!t.hasAttribute("disabled")&&!t.matches('[tabindex="-1"]')));e&&e.focus()}},genContent(){return this.showLazyContent((()=>[this.$createElement(i.A,{props:{root:!0,light:this.light,dark:this.dark}},[this.$createElement("div",{class:this.contentClasses,attrs:{role:"dialog","aria-modal":this.hideOverlay?void 0:"true",...this.getScopeIdAttrs()},on:{keydown:this.onKeydown},style:{zIndex:this.activeZIndex},ref:"content"},[this.genTransition()])])]))},genTransition(){const t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent(){const t={class:this.classes,attrs:{tabindex:this.isActive?0:void 0},ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style={...t.style,maxWidth:(0,p.Dg)(this.maxWidth),width:(0,p.Dg)(this.width)}),this.$createElement("div",t,this.getContentSlot())}},render(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},[this.genActivator(),this.genContent()])}})},8230:function(t,e,s){s(4114);var i=s(3507),r=s(4765),n=s(8652),o=s(6960);e.A=(0,i.A)(r.A,(0,n.G)("form")).extend({name:"v-form",provide(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:()=>({inputs:[],watchers:[],errorBag:{}}),watch:{errorBag:{handler(t){const e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput(t){const e=t=>t.$watch("hasError",(e=>{this.$set(this.errorBag,t._uid,e)}),{immediate:!0}),s={_uid:t._uid,valid:()=>{},shouldValidate:()=>{}};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",(i=>{i&&(this.errorBag.hasOwnProperty(t._uid)||(s.valid=e(t)))})):s.valid=e(t),s},validate(){return 0===this.inputs.filter((t=>!t.validate(!0))).length},reset(){this.inputs.forEach((t=>t.reset())),this.resetErrorBag()},resetErrorBag(){this.lazyValidation&&setTimeout((()=>{this.errorBag={}}),0)},resetValidation(){this.inputs.forEach((t=>t.resetValidation())),this.resetErrorBag()},register(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister(t){const e=this.inputs.find((e=>e._uid===t._uid));if(!e)return;const s=this.watchers.find((t=>t._uid===e._uid));s&&(s.valid(),s.shouldValidate()),this.watchers=this.watchers.filter((t=>t._uid!==e._uid)),this.inputs=this.inputs.filter((t=>t._uid!==e._uid)),this.$delete(this.errorBag,e._uid)}},render(t){return t("form",{staticClass:"v-form",attrs:{novalidate:!0,...this.attrs$},on:{submit:t=>this.$emit("submit",t)}},(0,o.$c)(this))}})},1526:function(t,e,s){s(4114),s(125);var i=s(5471),r=s(4961),n=s(6960);const o=["sm","md","lg","xl"],a=(()=>o.reduce(((t,e)=>(t[e]={type:[Boolean,String,Number],default:!1},t)),{}))(),l=(()=>o.reduce(((t,e)=>(t["offset"+(0,n.Zb)(e)]={type:[String,Number],default:null},t)),{}))(),c=(()=>o.reduce(((t,e)=>(t["order"+(0,n.Zb)(e)]={type:[String,Number],default:null},t)),{}))(),h={col:Object.keys(a),offset:Object.keys(l),order:Object.keys(c)};function u(t,e,s){let i=t;if(null!=s&&!1!==s){if(e){const s=e.replace(t,"");i+=`-${s}`}return"col"!==t||""!==s&&!0!==s?(i+=`-${s}`,i.toLowerCase()):i.toLowerCase()}}const d=new Map;e.A=i.Ay.extend({name:"v-col",functional:!0,props:{cols:{type:[Boolean,String,Number],default:!1},...a,offset:{type:[String,Number],default:null},...l,order:{type:[String,Number],default:null},...c,alignSelf:{type:String,default:null,validator:t=>["auto","start","end","center","baseline","stretch"].includes(t)},tag:{type:String,default:"div"}},render(t,{props:e,data:s,children:i,parent:n}){let o="";for(const r in e)o+=String(e[r]);let a=d.get(o);if(!a){let t;for(t in a=[],h)h[t].forEach((s=>{const i=e[s],r=u(t,s,i);r&&a.push(r)}));const s=a.some((t=>t.startsWith("col-")));a.push({col:!s||!e.cols,[`col-${e.cols}`]:e.cols,[`offset-${e.offset}`]:e.offset,[`order-${e.order}`]:e.order,[`align-self-${e.alignSelf}`]:e.alignSelf}),d.set(o,a)}return t(e.tag,(0,r.Ay)(s,{class:a}),i)}})},6278:function(t,e,s){s.d(e,{A:function(){return o}});s(158),s(125);var i=s(5471);function r(t){return i.Ay.extend({name:`v-${t}`,functional:!0,props:{id:String,tag:{type:String,default:"div"}},render(e,{props:s,data:i,children:r}){i.staticClass=`${t} ${i.staticClass||""}`.trim();const{attrs:n}=i;if(n){i.attrs={};const t=Object.keys(n).filter((t=>{if("slot"===t)return!1;const e=n[t];return t.startsWith("data-")?(i.attrs[t]=e,!1):e||"string"===typeof e}));t.length&&(i.staticClass+=` ${t.join(" ")}`)}return s.id&&(i.domProps=i.domProps||{},i.domProps.id=s.id),e(s.tag,i,r)}})}var n=s(4961),o=r("container").extend({name:"v-container",functional:!0,props:{id:String,tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},render(t,{props:e,data:s,children:i}){let r;const{attrs:o}=s;return o&&(s.attrs={},r=Object.keys(o).filter((t=>{if("slot"===t)return!1;const e=o[t];return t.startsWith("data-")?(s.attrs[t]=e,!1):e||"string"===typeof e}))),e.id&&(s.domProps=s.domProps||{},s.domProps.id=e.id),t(e.tag,(0,n.Ay)(s,{staticClass:"container",class:Array({"container--fluid":e.fluid}).concat(r||[])}),i)}})},8412:function(t,e,s){s(4114),s(125);var i=s(5471),r=s(4961),n=s(6960);const o=["sm","md","lg","xl"],a=["start","end","center"];function l(t,e){return o.reduce(((s,i)=>(s[t+(0,n.Zb)(i)]=e(),s)),{})}const c=t=>[...a,"baseline","stretch"].includes(t),h=l("align",(()=>({type:String,default:null,validator:c}))),u=t=>[...a,"space-between","space-around"].includes(t),d=l("justify",(()=>({type:String,default:null,validator:u}))),p=t=>[...a,"space-between","space-around","stretch"].includes(t),m=l("alignContent",(()=>({type:String,default:null,validator:p}))),v={align:Object.keys(h),justify:Object.keys(d),alignContent:Object.keys(m)},f={align:"align",justify:"justify",alignContent:"align-content"};function g(t,e,s){let i=f[t];if(null!=s){if(e){const s=e.replace(t,"");i+=`-${s}`}return i+=`-${s}`,i.toLowerCase()}}const y=new Map;e.A=i.Ay.extend({name:"v-row",functional:!0,props:{tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:c},...h,justify:{type:String,default:null,validator:u},...d,alignContent:{type:String,default:null,validator:p},...m},render(t,{props:e,data:s,children:i}){let n="";for(const r in e)n+=String(e[r]);let o=y.get(n);if(!o){let t;for(t in o=[],v)v[t].forEach((s=>{const i=e[s],r=g(t,s,i);r&&o.push(r)}));o.push({"no-gutters":e.noGutters,"row--dense":e.dense,[`align-${e.align}`]:e.align,[`justify-${e.justify}`]:e.justify,[`align-content-${e.alignContent}`]:e.alignContent}),y.set(n,o)}return t(e.tag,(0,r.Ay)(s,{staticClass:"row",class:o}),i)}})},7410:function(t,e,s){s(158);var i=s(6960);e.A=(0,i.Gn)("spacer","div","v-spacer")},4847:function(t,e,s){s.d(e,{A:function(){return l}});s(4114);var i=s(8767),r=s(3661),n=s(9748),o=s(3507),a=s(6960),l=(0,o.A)(i.A,r.A,n.A).extend({name:"v-overlay",props:{absolute:Boolean,color:{type:String,default:"#212121"},dark:{type:Boolean,default:!0},opacity:{type:[Number,String],default:.46},value:{default:!0},zIndex:{type:[Number,String],default:5}},computed:{__scrim(){const t=this.setBackgroundColor(this.color,{staticClass:"v-overlay__scrim",style:{opacity:this.computedOpacity}});return this.$createElement("div",t)},classes(){return{"v-overlay--absolute":this.absolute,"v-overlay--active":this.isActive,...this.themeClasses}},computedOpacity(){return Number(this.isActive?this.opacity:0)},styles(){return{zIndex:this.zIndex}}},methods:{genContent(){return this.$createElement("div",{staticClass:"v-overlay__content"},(0,a.$c)(this))}},render(t){const e=[this.__scrim];return this.isActive&&e.push(this.genContent()),t("div",{staticClass:"v-overlay",on:this.$listeners,class:this.classes,style:this.styles},e)}})},7402:function(t,e,s){s.d(e,{A:function(){return o}});var i=s(9940),r=s(3507);const n=(0,r.A)(i.A);var o=n.extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:t=>!isNaN(parseFloat(t))},rows:{type:[Number,String],default:5,validator:t=>!isNaN(parseInt(t,10))}},computed:{classes(){return{"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle,...i.A.options.computed.classes.call(this)}},noResizeHandle(){return this.noResize||this.autoGrow}},watch:{autoGrow(t){this.$nextTick((()=>{var e;t?this.calculateInputHeight():null===(e=this.$refs.input)||void 0===e||e.style.removeProperty("height")}))},lazyValue(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted(){setTimeout((()=>{this.autoGrow&&this.calculateInputHeight()}),0)},methods:{calculateInputHeight(){const t=this.$refs.input;if(!t)return;t.style.height="0";const e=t.scrollHeight,s=parseInt(this.rows,10)*parseFloat(this.rowHeight);t.style.height=Math.max(s,e)+"px"},genInput(){const t=i.A.options.methods.genInput.call(this);return t.tag="textarea",delete t.data.attrs.type,t.data.attrs.rows=this.rows,t},onInput(t){i.A.options.methods.onInput.call(this,t),this.autoGrow&&this.calculateInputHeight()},onKeyDown(t){this.isFocused&&13===t.keyCode&&t.stopPropagation(),this.$emit("keydown",t)}}})},123:function(t,e,s){s.d(e,{A:function(){return a}});var i=s(4847),r=i.A,n=s(6960),o=s(5471),a=o.Ay.extend().extend({name:"overlayable",props:{hideOverlay:Boolean,overlayColor:String,overlayOpacity:[Number,String]},data(){return{animationFrame:0,overlay:null}},watch:{hideOverlay(t){this.isActive&&(t?this.removeOverlay():this.genOverlay())}},beforeDestroy(){this.removeOverlay()},methods:{createOverlay(){const t=new r({propsData:{absolute:this.absolute,value:!1,color:this.overlayColor,opacity:this.overlayOpacity}});t.$mount();const e=this.absolute?this.$el.parentNode:document.querySelector("[data-app]");e&&e.insertBefore(t.$el,e.firstChild),this.overlay=t},genOverlay(){if(this.hideScroll(),!this.hideOverlay)return this.overlay||this.createOverlay(),this.animationFrame=requestAnimationFrame((()=>{this.overlay&&(void 0!==this.activeZIndex?this.overlay.zIndex=String(this.activeZIndex-1):this.$el&&(this.overlay.zIndex=(0,n.fl)(this.$el)),this.overlay.value=!0)})),!0},removeOverlay(t=!0){this.overlay&&((0,n.d7)(this.overlay.$el,"transitionend",(()=>{this.overlay&&this.overlay.$el&&this.overlay.$el.parentNode&&!this.overlay.value&&!this.isActive&&(this.overlay.$el.parentNode.removeChild(this.overlay.$el),this.overlay.$destroy(),this.overlay=null)})),cancelAnimationFrame(this.animationFrame),this.overlay.value=!1),t&&this.showScroll()},scrollListener(t){if("key"in t){if(["INPUT","TEXTAREA","SELECT"].includes(t.target.tagName)||t.target.isContentEditable)return;const e=[n.uP.up,n.uP.pageup],s=[n.uP.down,n.uP.pagedown];if(e.includes(t.keyCode))t.deltaY=-1;else{if(!s.includes(t.keyCode))return;t.deltaY=1}}(t.target===this.overlay||"keydown"!==t.type&&t.target===document.body||this.checkPath(t))&&t.preventDefault()},hasScrollbar(t){if(!t||t.nodeType!==Node.ELEMENT_NODE)return!1;const e=window.getComputedStyle(t);return(["auto","scroll"].includes(e.overflowY)||"SELECT"===t.tagName)&&t.scrollHeight>t.clientHeight||["auto","scroll"].includes(e.overflowX)&&t.scrollWidth>t.clientWidth},shouldScroll(t,e){if(t.hasAttribute("data-app"))return!1;const s=e.shiftKey||e.deltaX?"x":"y",i="y"===s?e.deltaY:e.deltaX||e.deltaY;let r,n;"y"===s?(r=0===t.scrollTop,n=t.scrollTop+t.clientHeight===t.scrollHeight):(r=0===t.scrollLeft,n=t.scrollLeft+t.clientWidth===t.scrollWidth);const o=i<0,a=i>0;return!(r||!o)||(!(n||!a)||!(!r&&!n||!t.parentNode)&&this.shouldScroll(t.parentNode,e))},isInside(t,e){return t===e||null!==t&&t!==document.body&&this.isInside(t.parentNode,e)},checkPath(t){const e=(0,n.K9)(t);if("keydown"===t.type&&e[0]===document.body){const e=this.$refs.dialog,s=window.getSelection().anchorNode;return!(e&&this.hasScrollbar(e)&&this.isInside(s,e))||!this.shouldScroll(e,t)}for(let s=0;s<e.length;s++){const i=e[s];if(i===document)return!0;if(i===document.documentElement)return!0;if(i===this.$refs.content)return!0;if(this.hasScrollbar(i))return!this.shouldScroll(i,t)}return!0},hideScroll(){this.$vuetify.breakpoint.smAndDown?document.documentElement.classList.add("overflow-y-hidden"):((0,n.P4)(window,"wheel",this.scrollListener,{passive:!1}),window.addEventListener("keydown",this.scrollListener))},showScroll(){document.documentElement.classList.remove("overflow-y-hidden"),window.removeEventListener("wheel",this.scrollListener),window.removeEventListener("keydown",this.scrollListener)}}})},4466:function(t,e,s){s(4114);var i=s(1723),r=s(5471);e.A=r.Ay.extend({name:"rippleable",directives:{ripple:i.A},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}})},4680:function(t,e,s){s.d(e,{F:function(){return a}});s(4114);var i=s(3960),r=s(4466),n=s(5088),o=s(3507);function a(t){t.preventDefault()}e.A=(0,o.A)(i.A,r.A,n.A).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=i.A.options.methods.genLabel.call(this);return t?(t.data.on={click:a},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:a},ref:"input"})},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const s=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===s&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(t){this.isFocused=!0,this.$emit("focus",t)},onBlur(t){this.isFocused=!1,this.$emit("blur",t)},onKeydown(t){}}})}}]);
//# sourceMappingURL=15.aaf29869.js.map