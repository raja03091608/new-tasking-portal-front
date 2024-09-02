import { Routes } from '@angular/router';

const Routing: Routes = [
    {
		path: '',
    data : {title:'Dashboard'},
		redirectTo: '/dashboard/dashboard1',
		pathMatch: 'full',
	  },
	{
    path: 'dashboard',
    data : {title:'Dashboard'},
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'tasking-portal',
    data : {title:'Tasking Portal'},
    loadChildren: () =>
      import('./tasking-portal/tasking-portal.module').then((m) => m.TaskingPortalModule),
  },

  {
    path: 'master',
    loadChildren: () =>
      import('./master/master.module').then((m) => m.MasterModule),
  },

  {
    path: 'access-module',
    loadChildren: () =>
      import('./access-module/access-module.module').then((m) => m.AccessModuleModule),
  },
  {
    path: 'project',
    data : {title:'Project'},
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: 'wish',
    loadChildren: () =>
      import('./wish/wish.module').then((m) => m.WishModule),
  },

  {
    path: 'website',
    loadChildren: () =>
      import('./Manage-Website/manage-website.module').then((m) => m.ManageWebsiteModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },

  {
    path: '**',
    redirectTo: 'error/404',
  },


];

export { Routing };
