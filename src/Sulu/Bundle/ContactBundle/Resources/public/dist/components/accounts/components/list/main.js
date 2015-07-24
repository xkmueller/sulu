define(["mvc/relationalstore","app-config","widget-groups"],function(a,b,c){"use strict";var d={datagridInstanceName:"accounts"},e=function(){this.sandbox.on("sulu.toolbar.delete",function(){this.sandbox.emit("husky.datagrid."+d.datagridInstanceName+".items.get-selected",function(a){this.sandbox.emit("sulu.contacts.accounts.delete",a)}.bind(this))},this),this.sandbox.on("sulu.toolbar.add",function(){this.sandbox.emit("sulu.contacts.accounts.new")},this),this.sandbox.on("husky.datagrid."+d.datagridInstanceName+".number.selections",function(a){var b=a>0?"enable":"disable";this.sandbox.emit("sulu.header.toolbar.item."+b,"delete",!1)}.bind(this))},f=function(a){this.sandbox.emit("sulu.sidebar.set-widget","/admin/widget-groups/account-info?account="+a)},g=function(a){this.sandbox.emit("sulu.contacts.accounts.load",a)};return{view:!0,layout:{content:{width:"max"},sidebar:{width:"fixed",cssClasses:"sidebar-padding-50"}},header:function(){return{title:"contact.accounts.title",noBack:!0,breadcrumb:[{title:"navigation.contacts"},{title:"contact.accounts.title"}],toolbar:{buttons:["add","delete"]}}},templates:["/admin/contact/template/account/list"],initialize:function(){this.render(),e.call(this)},render:function(){a.reset(),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/contact/template/account/list")),this.sandbox.sulu.initListToolbarAndList.call(this,"accounts","/admin/api/accounts/fields",{el:this.$find("#list-toolbar-container"),instanceName:"accounts",template:"default"},{el:this.sandbox.dom.find("#companies-list",this.$el),url:"/admin/api/accounts?flat=true",resultKey:"accounts",searchInstanceName:"accounts",instanceName:d.datagridInstanceName,searchFields:["name"],clickCallback:c.exists("account-info")?f.bind(this):null,actionCallback:g.bind(this)},"accounts","#companies-list-info")}}});