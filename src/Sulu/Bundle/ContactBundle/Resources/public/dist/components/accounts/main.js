define(["sulucontact/model/account","sulucontact/model/contact","sulucontact/model/accountContact","accountsutil/header","sulucontact/model/email","sulucontact/model/emailType","sulumedia/model/media","sulucategory/model/category","accountsutil/delete-dialog"],function(a,b,c,d,e,f,g,h,i){"use strict";return{initialize:function(){this.bindCustomEvents(),this.bindSidebarEvents(),this.account=null,this.renderByDisplay()},renderByDisplay:function(){if("list"===this.options.display)this.renderList();else if("form"===this.options.display)this.renderForm().then(this.setHeader.bind(this));else if("contacts"===this.options.display)this.renderComponent("accounts/components/",this.options.display,"accounts-form-container",{}).then(this.setHeader.bind(this));else{if("documents"!==this.options.display)throw"display type wrong";this.renderComponent("",this.options.display,"documents-form",{type:"account"}).then(this.setHeader.bind(this))}},setHeader:function(){d.setHeader.call(this,this.account)},bindCustomEvents:function(){this.sandbox.on("sulu.contacts.account.delete",this.del.bind(this)),this.sandbox.on("sulu.contacts.accounts.save",this.save.bind(this)),this.sandbox.on("sulu.contacts.accounts.load",this.load.bind(this)),this.sandbox.on("sulu.contacts.contact.load",this.loadContact.bind(this)),this.sandbox.on("sulu.contacts.accounts.new",this.add.bind(this)),this.sandbox.on("sulu.contacts.accounts.delete",this.delAccounts.bind(this)),this.sandbox.on("sulu.contacts.accounts.contact.save",this.addAccountContact.bind(this)),this.sandbox.on("sulu.contacts.accounts.contacts.remove",this.removeAccountContacts.bind(this)),this.sandbox.on("sulu.contacts.accounts.contacts.set-main",this.setMainContact.bind(this)),this.sandbox.on("sulu.contacts.accounts.list",this.navigateToList.bind(this)),this.sandbox.on("sulu.contacts.accounts.medias.save",this.saveDocuments.bind(this)),this.sandbox.on("sulu.contacts.set-types",function(a){this.formOfAddress=a.formOfAddress,this.emailTypes=a.emailTypes}.bind(this)),this.sandbox.on("sulu.contacts.accounts.contacts.initialized",function(){this.sandbox.emit("sulu.contacts.accounts.set-form-of-address",this.formOfAddress)}.bind(this)),this.sandbox.on("sulu.contacts.accounts.new.contact",this.createNewContact.bind(this))},navigateToList:function(a,b){this.sandbox.emit("sulu.router.navigate","contacts/accounts",!b,!0,!0)},createNewContact:function(a){var c=new b(a);c.set("emails",[new e({email:a.email,emailType:f.findOrCreate({id:this.emailTypes[0].id})})]),c.save(null,{success:function(a){var b=a.toJSON();this.sandbox.emit("sulu.contacts.accounts.contact.created",b)}.bind(this),error:function(){this.sandbox.logger.log("error while saving a new contact")}.bind(this)})},saveDocuments:function(a,b,c){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.sandbox.logger.warn("newMediaIds",b),this.sandbox.logger.warn("removedMediaIds",c),this.processAjaxForDocuments(b,a,"POST"),this.processAjaxForDocuments(c,a,"DELETE")},processAjaxForDocuments:function(a,b,c){var d,e=[],f=[];a.length>0&&(this.sandbox.util.each(a,function(a,g){"DELETE"===c?d="/admin/api/accounts/"+b+"/medias/"+g:"POST"===c&&(d="/admin/api/accounts/"+b+"/medias"),e.push(this.sandbox.util.ajax({url:d,data:{mediaId:g},type:c}).fail(function(){this.sandbox.logger.error("Error while saving documents!")}.bind(this))),f.push(g)}.bind(this)),this.sandbox.util.when.apply(null,e).then(function(){"DELETE"===c?(this.sandbox.logger.warn(f),this.sandbox.emit("sulu.contacts.contacts.medias.removed",f)):"POST"===c&&(this.sandbox.logger.warn(f),this.sandbox.emit("sulu.contacts.contacts.medias.saved",f))}.bind(this)))},bindSidebarEvents:function(){this.sandbox.dom.off("#sidebar"),this.sandbox.dom.on("#sidebar","click",function(a){var b=this.sandbox.dom.data(a.currentTarget,"id");this.sandbox.emit("sulu.contacts.accounts.load",b)}.bind(this),"#sidebar-accounts-list"),this.sandbox.dom.on("#sidebar","click",function(a){var b=this.sandbox.dom.data(a.currentTarget,"id");this.sandbox.emit("sulu.router.navigate","contacts/contacts/edit:"+b+"/details"),this.sandbox.emit("husky.navigation.select-item","contacts/contacts")}.bind(this),"#main-contact")},getAccount:function(b){this.account=new a({id:b}),this.account.fetch({success:function(a){this.account=a,this.dfdAccount.resolve()}.bind(this),error:function(){this.sandbox.logger.log("error while fetching contact")}.bind(this)})},setMainContact:function(a){this.account.set({mainContact:b.findOrCreate({id:a})}),this.account.save(null,{patch:!0,success:function(){}.bind(this)})},addAccountContact:function(a,d){var e=c.findOrCreate({id:a,contact:b.findOrCreate({id:a}),account:this.account});d&&e.set({position:d}),e.save(null,{success:function(a){var b=a.toJSON();this.sandbox.emit("sulu.contacts.accounts.contact.saved",b)}.bind(this),error:function(){this.sandbox.logger.log("error while saving contact")}.bind(this)})},removeAccountContacts:function(a){this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","sulu.overlay.delete-desc",null,function(){var d;this.sandbox.util.foreach(a,function(a){d=c.findOrCreate({id:a,contact:b.findOrCreate({id:a}),account:this.account}),d.destroy({success:function(){this.sandbox.emit("sulu.contacts.accounts.contacts.removed",a)}.bind(this),error:function(){this.sandbox.logger.log("error while deleting AccountContact")}.bind(this)})}.bind(this))}.bind(this))},del:function(){i.showForSingle(this.sandbox,this.account,this.options.id)},save:function(a,b){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.account.set(a),this.account.get("categories").reset(),this.sandbox.util.foreach(a.categories,function(a){var b=h.findOrCreate({id:a});this.account.get("categories").add(b)}.bind(this)),this.account.save(null,{success:function(c){var d=c.toJSON();a.id&&this.sandbox.emit("sulu.contacts.accounts.saved",d),"back"==b?this.navigateToList():"new"==b?this.sandbox.emit("sulu.router.navigate","contacts/accounts/add",!0,!0):a.id||this.sandbox.emit("sulu.router.navigate","contacts/accounts/edit:"+d.id+"/details")}.bind(this),error:function(){this.sandbox.logger.log("error while saving profile")}.bind(this)})},load:function(a){this.sandbox.emit("sulu.router.navigate","contacts/accounts/edit:"+a+"/details")},loadContact:function(a){this.sandbox.emit("sulu.router.navigate","contacts/contacts/edit:"+a+"/details")},add:function(){this.sandbox.emit("sulu.router.navigate","contacts/accounts/add")},delAccounts:function(a){return a.length<1?void this.sandbox.emit("sulu.overlay.show-error","sulu.overlay.delete-no-items"):void this.showDeleteConfirmation(a)},renderList:function(){var a=this.sandbox.dom.createElement('<div id="accounts-list-container"/>');this.html(a),this.sandbox.start([{name:"accounts/components/list@sulucontact",options:{el:a}}])},renderComponent:function(b,c,d,e,f){var g=this.sandbox.dom.createElement('<div id="'+d+'"/>'),h=this.sandbox.data.deferred();return this.html(g),this.options.id&&(this.account=new a({id:this.options.id}),this.account.fetch({success:function(a){this.account=a,this.sandbox.start([{name:b+c+"@"+(f?f:"sulucontact"),options:{el:g,data:a.toJSON(),params:e?e:{}}}]),h.resolve()}.bind(this),error:function(){this.sandbox.logger.log("error while fetching contact"),h.reject()}.bind(this)})),h.promise()},renderForm:function(){this.account=new a;var b=this.sandbox.dom.createElement('<div id="accounts-form-container"/>'),c=this.sandbox.data.deferred();return this.html(b),this.options.id?(this.account=new a({id:this.options.id}),this.account.fetch({success:function(a){this.sandbox.start([{name:"accounts/components/form@sulucontact",options:{el:b,data:a.toJSON()}}]),c.resolve()}.bind(this),error:function(){this.sandbox.logger.log("error while fetching contact"),c.reject()}.bind(this)})):this.renderCreateForm(c,b),c.promise()},renderCreateForm:function(a,b){this.sandbox.start([{name:"accounts/components/form@sulucontact",options:{el:b,data:this.account.toJSON()}}]),a.resolve()},showDeleteConfirmation:function(b){0!==b.length&&(1===b.length?i.showForSingle(this.sandbox,a.findOrCreate({id:b[0]}),b[0],!0):i.showForMultiple(this.sandbox,b))}}});