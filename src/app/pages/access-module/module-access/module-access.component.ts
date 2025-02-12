import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from "../../../service/api.service";
import { ConsoleService } from "../../../service/console.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "../../../service/notification.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { language } from "../../../../environments/language";

@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.scss']
})
export class ModuleAccessComponent implements OnInit {

  constructor(private api : ApiService,
    private notification : NotificationService,
    private dialog : MatDialog, private logger : ConsoleService) { }

  processes = [];
  roles :any= [];
  data: any;
  action:any;
  allSelected=false;
  modules=[];
  process:any;
  user_role:any;
  permission_id='';
  
  displayedColumns: string[] = [
    "module",
    "module_components",
    "module_components_attribute",
    "action",
    "status",
    "edit",
    "delete",
  ];
  ngOnInit(): void {
    this.getProcess();

  }
  processChange(process_id)
  {
    this.user_role='';
    if(process_id)
      this.getUserRole(process_id);
    if(!process_id)
    {
      this.modules=[];
    }
    else if(!this.user_role)
      this.getModuleAccess(process_id);
    else
    {
      this.getRoleAccess();
    }
    if(this.user_role)
      this.getRoleAccess();

  }
  roleChange(role_id)
  {

    if(!this.process)
    {
      this.notification.displayMessage(language[environment.DEFAULT_LANG].processFirst);
      this.user_role='';
    }
    else
    {
      if(role_id)
        this.getRoleAccess();
      else
      {
        this.getModuleAccess(this.process);
      }
    }

  }

  getModuleAccess(process_id) {
    this.api
      .getAPI(environment.API_URL + "access/allmodules?process_id="+process_id)
      .subscribe((res) => {
        this.modules=this.formatStatus(res.data);
      });
  }

  getRoleAccess() {
    if(this.process && this.user_role)
    {
      this.api
      .getAPI(environment.API_URL + "access/permissions?process_id="+this.process+'&user_role_id='+this.user_role)
      .subscribe((res) => {

        if(res.data.length>0)
        {
          let permissions=JSON.parse(res.data[0].permissions);
          this.permission_id=res.data[0].id;
          if(permissions.length>0)
          {
            this.updatePermissions(permissions);
          }
          else
          {
            this.permission_id='';
            this.getModuleAccess(this.process);
          }
        }
        else
        {
          this.permission_id='';
          this.getModuleAccess(this.process);
        }
      });
    }

  }

  updatePermissions(permissions)
  {
    if(this.modules)
    {
      (this.modules).filter(function(module){
        /* Module Status */
        let moduleStatus=(permissions).filter(function(p_module){
          if(p_module.id==module.id)
          {
            module.status=p_module.status;
            return p_module.status;
          }
        });
        (module.components).filter(function(component){
          let componentStatus=(permissions).filter(function(p_module){
            if(p_module.id==module.id)
            {
              (p_module.components).filter(function(p_component){
                if(p_component.id==component.id)
                {
                  component.status=p_component.status;
                  return p_component.status;
                }
              });
            }
          });

          /* Attribute Status */
          (component.attributes).filter(function(attribute){
            let attributeStatus=(permissions).filter(function(p_module){
              if(p_module.id==module.id)
              {
                (p_module.components).filter(function(p_component){
                  if(p_component.id==component.id)
                  {
                    (p_component.attributes).filter(function(p_attribute){
                      if(p_attribute.id==attribute.id)
                      {
                        attribute.status=p_attribute.status;
                        return p_attribute.status;
                      }
                    });
                  }
                });
              }
            });
          });
        });

        (module.action).filter(function(module_action){
          let moduleActionStatus=(permissions).filter(function(p_module){
            if(p_module.id==module.id)
            {
              (p_module.action).filter(function(p_module_action){
                if(p_module_action.id==module_action.id)
                {
                  module_action.status=p_module_action.status;
                  return p_module_action.status;
                }
              });
            }
          });
        });

        (module.components).filter(function(component){
          let componentActionStatus=(permissions).filter(function(p_module){
            if(p_module.id==module.id)
            {
              (p_module.components).filter(function(p_component){
                if(p_component.id==component.id)
                {
                  (component.action).filter(function(component_action){
                      (p_component.action).filter(function(pcomponent_action){
                        if(component_action.id==pcomponent_action.id)
                        {
                          component_action.status=pcomponent_action.status;
                          return pcomponent_action.status;
                        }
                      });
                  });

                }
              });
            }
          });

          (component.attributes).filter(function(attribute){
            let componentActionStatus=(permissions).filter(function(p_module){
              if(p_module.id==module.id)
              {
                (p_module.components).filter(function(p_component){
                  if(p_component.id==component.id)
                  {
                    (attribute.action).filter(function(attribute_action){
                        (p_component.attributes).filter(function(pcomponent_attribute){
                          (pcomponent_attribute.action).filter(function(pcomponent_attribute_action){
                            if(attribute_action.id==pcomponent_attribute_action.id)
                            {
                              attribute_action.status=pcomponent_attribute_action.status;
                              return pcomponent_attribute_action.status;
                            }
                          });

                        });
                    });

                  }
                });
              }
            });
          });

        });

      });
    }
  }

  savePermission()
  {
    if(!this.process)
      this.notification.displayMessage(language[environment.DEFAULT_LANG].process);
    else if(!this.user_role)
      this.notification.displayMessage(language[environment.DEFAULT_LANG].userRole);
    else
    {
      this.api.postAPI(environment.API_URL + "access/permissions/details", {
        id: this.permission_id,
        user_role:this.user_role,
        process:this.process,
        permissions:JSON.stringify(this.modules)
      }).subscribe((res) => {
        if(res.status=='success')
        {
          this.permission_id=res.data.id;
        }
        this.notification.success(res.message);
      });
    }
  }

  formatStatus(modules)
  {
    if(modules.length>0)
    {
      (modules).filter(function(module){
        module.status=false;
        (module.components).filter(function(component){
          component.status=false;
          (component.attributes).filter(function(attribute){
            attribute.status=false;
              (attribute.action).filter(function(action){
                action.status=false;
              });
          });
          (component.action).filter(function(action){
            action.status=false;
          });
        });
        (module.action).filter(function(action){
          action.status=false;
        });
      });
    }
    return modules;
  }


  getProcess() {
    this.api
    .getAPI(environment.API_URL + "access/process")
    .subscribe((res)=> {
      this.processes = res.data;
    });
  }

  getUserRole(process_id='') {
    let searchString='?status=1';
    searchString+=process_id?'&process_id='+process_id:'';
    this.api
    .getAPI(environment.API_URL + "access/access_user_roles"+searchString)
    .subscribe((res)=> {
      this.roles = res.data;
    });
  }
  parentCheck(modules,action_id,status)
  {
    for (let i = 0; i < modules.components.length; i++) {
      let componentActions=modules.components[i].action;
      for (let j = 0; j < componentActions.length; j++) {
        if(componentActions[j].id ==action_id)
          componentActions[j].status=status;
        let attributes=modules.components[i].attributes;
        for (let k = 0; k < attributes.length; k++) {
          for (let l = 0; l < attributes[k].action.length; l++) {
            if(attributes[k].action[j].id ==action_id)
              attributes[k].action[j].status=status;
          }
        }
      }
    }
  }
  childCheck(modules, components,action_id) {
    let selectedComponents=(components).filter(function(component){
      let selectedActions=(component.action).filter(function(action){
        if(action.id==action_id && action.status)
        {
          return action.status;
        }
      });
      return selectedActions.length>0;
    });

    (modules.action).filter(function(action){
      if(action.id==action_id)
        action.status=selectedComponents.length>0?true:false;
    });
  }

  childCheck2(modules, components,attributes,action_id,all_componets) {
    let selectedAttributes=(attributes).filter(function(attribute){
      let selectedActions=(attribute.action).filter(function(action){
        if(action.id==action_id && action.status)
        {
          return action.status;
        }
      });
      return selectedActions.length>0;
    });

    let selectedComponents=(all_componets).filter(function(component){
      let selectedActions=(component.action).filter(function(action){
        if(action.id==action_id && action.status)
        {
          return action.status;
        }
      });
      return selectedActions.length>0;
    });

    (modules.action).filter(function(action){
      if(action.id==action_id)
        action.status=selectedAttributes.length>0?true:(selectedComponents.length>0?true:false);
    });
    (components.action).filter(function(action){
      if(action.id==action_id)
        action.status=selectedAttributes.length>0?true:false;
    });
  }

  parentToggle(modules,status)
  {
    for (let i = 0; i < modules.components.length; i++) {
      let component=modules.components[i];
      component.status=status;

      let attributes=component.attributes;
      for (let j = 0; j < attributes.length; j++) {
        attributes[j].status=status;
      }
    }
  }

  childToggle(modules, component,status) {
    component.status=status;
    let selectedComponents=(modules.components).filter(function(component){
      return component.status==true;
    });
    modules.status=selectedComponents.length>0?true:false;
  }
  child2Toggle(modules, component,attribute,status) {
    attribute.status=status;
    let selectedAttributes=(component.attributes).filter(function(attribute){
      return attribute.status==true;
    });
    let selectedComponents=(modules.components).filter(function(component){
      return component.status==true;
    });

    component.status=selectedAttributes.length>0?true:false;
    modules.status=selectedAttributes.length>0?true:(selectedComponents.length>0?true:false);
  }
}
