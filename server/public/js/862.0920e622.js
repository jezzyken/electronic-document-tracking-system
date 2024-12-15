"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[862],{9840:function(e,t,s){s.r(t),s.d(t,{default:function(){return M}});var o=s(2781),a=s(375),i=s(7210),r=s(8834),l=s(3882),n=s(6278),c=s(1373),u=s(4155),d=s(1770),h=s(8230),m=s(9456),p=s(4847),f=s(2585),v=s(1556),A=s(3021),g=s(7410),w=s(9093),b=s(9940),k=s(7402),x=s(7043),y=s(4794),_=function(){var e=this,t=e._self._c;return t(n.A,[t(i.A,{attrs:{elevation:"2"}},[t(r.ri,{staticClass:"d-flex align-center py-3 px-4"},[t("h2",{staticClass:"text-h5 font-weight-bold mb-0"},[e._v("Role Management")]),t(g.A),t(a.A,{staticClass:"px-4",attrs:{color:"primary","prepend-icon":"mdi-plus"},on:{click:e.openCreateModal}},[e._v(" Create New Role ")])],1),t(d.A),t(c.A,{staticClass:"elevation-0",attrs:{headers:e.headers,items:e.roles,loading:e.loading,search:e.search,"items-per-page":10,"footer-props":{"items-per-page-options":[5,10,15,20],showFirstLastPage:!0}},scopedSlots:e._u([{key:"top",fn:function(){return[t(x.A,{staticClass:"px-4 d-flex justify-end",attrs:{flat:""}},[t(b.A,{staticClass:"mt-6",class:{"focused-field":e.isFocused},attrs:{"prepend-inner-icon":"mdi-magnify",label:"Search roles...","hide-details":"",dense:"",outlined:"",rounded:"",clearable:""},on:{"click:clear":function(t){e.search=""},focus:function(t){e.isFocused=!0},blur:function(t){e.isFocused=!1}},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}})],1)]},proxy:!0},{key:"item.name",fn:function({item:s}){return[t("div",{staticClass:"font-weight-medium"},[e._v(e._s(s.name))])]}},{key:"item.isActive",fn:function({item:s}){return[t(l.A,{attrs:{color:s.isActive?"success":"grey","text-color":s.isActive?"white":"",small:"",label:""}},[e._v(" "+e._s(s.isActive?"Active":"Inactive")+" ")])]}},{key:"item.permissions",fn:function({item:s}){return e._l(s.permissions,(function(s){return t(l.A,{key:s,staticClass:"mr-1 mb-1",attrs:{small:"",outlined:"",color:"primary"}},[e._v(" "+e._s(s)+" ")])}))}},{key:"item.actions",fn:function({item:s}){return[t(y.A,{attrs:{bottom:""},scopedSlots:e._u([{key:"activator",fn:function({on:o,attrs:i}){return[t(a.A,e._g(e._b({staticClass:"mr-2",attrs:{icon:"",small:"",color:"primary"},on:{click:function(t){return e.openEditModal(s)}}},"v-btn",i,!1),o),[t(m.A,{attrs:{small:""}},[e._v("mdi-pencil")])],1)]}}],null,!0)},[t("span",[e._v("Edit Role")])]),t(y.A,{attrs:{bottom:""},scopedSlots:e._u([{key:"activator",fn:function({on:o,attrs:i}){return[t(a.A,e._g(e._b({attrs:{icon:"",small:"",color:"error"},on:{click:function(t){return e.confirmDelete(s._id)}}},"v-btn",i,!1),o),[t(m.A,{attrs:{small:""}},[e._v("mdi-delete")])],1)]}}],null,!0)},[t("span",[e._v("Delete Role")])])]}},{key:"no-data",fn:function(){return[t(o.A,{staticClass:"ma-4",attrs:{type:"info",text:""}},[e._v(" No roles found ")])]},proxy:!0},{key:"progress",fn:function(){return[t(p.A,{attrs:{value:e.loading,absolute:""}},[t(f.A,{attrs:{indeterminate:"",size:"64"}})],1)]},proxy:!0}],null,!0)})],1),t(u.A,{attrs:{"max-width":"600px",persistent:""},model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[t(i.A,[t(r.ri,{staticClass:"py-3 px-4"},[t("span",{staticClass:"text-h5"},[e._v(e._s(e.isEditing?"Edit Role":"Create Role"))]),t(g.A),t(a.A,{attrs:{icon:""},on:{click:e.closeModal}},[t(m.A,[e._v("mdi-close")])],1)],1),t(d.A),t(r.OQ,{staticClass:"pt-4"},[t(h.A,{ref:"form",on:{submit:function(t){return t.preventDefault(),e.handleSubmit.apply(null,arguments)}},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[t(b.A,{attrs:{label:"Role Name",required:"",outlined:"",dense:"",rules:[e=>!!e||"Name is required"]},model:{value:e.roleForm.name,callback:function(t){e.$set(e.roleForm,"name",t)},expression:"roleForm.name"}}),t(v.A,{attrs:{items:e.availablePermissions,label:"Permissions",multiple:"",chips:"",outlined:"",dense:"",required:"",rules:[e=>e.length>0||"At least one permission is required"]},scopedSlots:e._u([{key:"selection",fn:function({item:s,index:o}){return[o<3?t(l.A,{staticClass:"mr-1",attrs:{small:"",label:""}},[e._v(" "+e._s(s)+" ")]):e._e(),3===o?t("span",{staticClass:"text-caption grey--text"},[e._v(" (+"+e._s(e.roleForm.permissions.length-3)+" more) ")]):e._e()]}}]),model:{value:e.roleForm.permissions,callback:function(t){e.$set(e.roleForm,"permissions",t)},expression:"roleForm.permissions"}}),t(k.A,{staticClass:"mt-3",attrs:{label:"Description",rows:"3",outlined:"",dense:"",placeholder:"Enter role description..."},model:{value:e.roleForm.description,callback:function(t){e.$set(e.roleForm,"description",t)},expression:"roleForm.description"}}),t(w.A,{staticClass:"mt-2",attrs:{label:"Active Status",color:"success","hide-details":""},model:{value:e.roleForm.isActive,callback:function(t){e.$set(e.roleForm,"isActive",t)},expression:"roleForm.isActive"}})],1)],1),t(d.A),t(r.SL,{staticClass:"py-3 px-4"},[t(g.A),t(a.A,{attrs:{text:"",color:"grey darken-1",disabled:e.loading},on:{click:e.closeModal}},[e._v(" Cancel ")]),t(a.A,{attrs:{color:"primary",loading:e.loading,disabled:!e.valid},on:{click:e.handleSubmit}},[e._v(" "+e._s(e.isEditing?"Update":"Create")+" ")])],1)],1)],1),t(u.A,{attrs:{"max-width":"400"},model:{value:e.showDeleteDialog,callback:function(t){e.showDeleteDialog=t},expression:"showDeleteDialog"}},[t(i.A,[t(r.ri,{staticClass:"py-3 px-4"},[t("span",{staticClass:"text-h6"},[e._v("Delete Role")])]),t(r.OQ,{staticClass:"pt-3"},[e._v(" Are you sure you want to delete this role? This action cannot be undone. ")]),t(r.SL,{staticClass:"py-3 px-4"},[t(g.A),t(a.A,{attrs:{text:"",color:"grey darken-1",disabled:e.loading},on:{click:function(t){e.showDeleteDialog=!1}}},[e._v(" Cancel ")]),t(a.A,{attrs:{color:"error",loading:e.loading},on:{click:e.handleDelete}},[e._v(" Delete ")])],1)],1)],1),t(A.A,{attrs:{color:e.snackbar.color,timeout:3e3,top:"",right:""},scopedSlots:e._u([{key:"action",fn:function({attrs:s}){return[t(a.A,e._b({attrs:{text:""},on:{click:function(t){e.snackbar.show=!1}}},"v-btn",s,!1),[e._v(" Close ")])]}}]),model:{value:e.snackbar.show,callback:function(t){e.$set(e.snackbar,"show",t)},expression:"snackbar.show"}},[e._v(" "+e._s(e.snackbar.text)+" ")])],1)},C=[],R=s(5353),F={name:"RoleManagement",data(){return{search:"",isFocused:!1,valid:!0,showModal:!1,showDeleteDialog:!1,isEditing:!1,roleForm:{name:"",permissions:[],description:"",isActive:!0},currentRoleId:null,headers:[{text:"Name",value:"name"},{text:"Permissions",value:"permissions"},{text:"Description",value:"description"},{text:"Status",value:"isActive"},{text:"Actions",value:"actions",sortable:!1}],availablePermissions:["view","create","update","delete","upload_attachments","view_attachments","change_document_status","recieved_document"],snackbar:{show:!1,text:"",color:""}}},computed:{...(0,R.aH)("roles",["loading","error"]),...(0,R.L8)("roles",["roles"])},methods:{...(0,R.i0)("roles",["fetchRoles","createRole","updateRole","deleteRole"]),showSnackbar(e,t="success"){this.snackbar={show:!0,text:e,color:t}},openCreateModal(){this.isEditing=!1,this.roleForm={name:"",permissions:[],description:"",isActive:!0},this.showModal=!0},openEditModal(e){this.isEditing=!0,this.currentRoleId=e._id,this.roleForm={name:e.name,permissions:[...e.permissions],description:e.description,isActive:e.isActive},this.showModal=!0},closeModal(){this.showModal=!1,this.$refs.form.reset()},async handleSubmit(){if(this.$refs.form.validate())try{this.isEditing?(await this.updateRole({id:this.currentRoleId,roleData:this.roleForm}),this.showSnackbar("Role updated successfully")):(await this.createRole(this.roleForm),this.showSnackbar("Role created successfully")),this.closeModal(),await this.fetchRoles()}catch(e){this.showSnackbar(e.message||"An error occurred","error")}},confirmDelete(e){this.currentRoleId=e,this.showDeleteDialog=!0},async handleDelete(){try{await this.deleteRole(this.currentRoleId),this.showSnackbar("Role deleted successfully"),this.showDeleteDialog=!1,await this.fetchRoles()}catch(e){this.showSnackbar(e.message||"An error occurred","error")}}},async created(){try{await this.fetchRoles()}catch(e){this.showSnackbar(e.message||"Failed to fetch roles","error")}}},D=F,S=s(1656),I=(0,S.A)(D,_,C,!1,null,"8ba42d4c",null),M=I.exports},7402:function(e,t,s){s.d(t,{A:function(){return r}});var o=s(9940),a=s(3507);const i=(0,a.A)(o.A);var r=i.extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:e=>!isNaN(parseFloat(e))},rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseInt(e,10))}},computed:{classes(){return{"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle,...o.A.options.computed.classes.call(this)}},noResizeHandle(){return this.noResize||this.autoGrow}},watch:{autoGrow(e){this.$nextTick((()=>{var t;e?this.calculateInputHeight():null===(t=this.$refs.input)||void 0===t||t.style.removeProperty("height")}))},lazyValue(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted(){setTimeout((()=>{this.autoGrow&&this.calculateInputHeight()}),0)},methods:{calculateInputHeight(){const e=this.$refs.input;if(!e)return;e.style.height="0";const t=e.scrollHeight,s=parseInt(this.rows,10)*parseFloat(this.rowHeight);e.style.height=Math.max(s,t)+"px"},genInput(){const e=o.A.options.methods.genInput.call(this);return e.tag="textarea",delete e.data.attrs.type,e.data.attrs.rows=this.rows,e},onInput(e){o.A.options.methods.onInput.call(this,e),this.autoGrow&&this.calculateInputHeight()},onKeyDown(e){this.isFocused&&13===e.keyCode&&e.stopPropagation(),this.$emit("keydown",e)}}})}}]);
//# sourceMappingURL=862.0920e622.js.map