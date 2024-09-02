import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { AddSliderComponent } from './add-slider/add-slider.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { PageListComponent } from './page-list/page-list.component';
import { AddPageComponent } from './add-page/add-page.component';
import { MenuComponent } from './menu/menu.component';
import { BlogsComponent } from './blogs/blogs.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AddHomepageComponent } from './add-homepage/add-homepage.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { FeaturedsComponent } from './featureds/featureds.component';
import { AddFeaturedComponent } from './add-featured/add-featured.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CKEditorModule } from 'ckeditor4-angular';
import { sanitizeHtmlPipe } from '../../service/sanitize-html.pipe';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';

import { AnnouncementsComponent } from './announcements/announcements.component';
// import { MaterialModule } from '../../../material/material.module';
import { AddAnnouncementsComponent } from './add-announcements/add-announcements.component';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
	declarations: [
		SliderComponent,
		AddSliderComponent,
		CategoriesListComponent,
		PageListComponent,
		AddPageComponent,
		MenuComponent,
		BlogsComponent,
		HomepageComponent,
		AddHomepageComponent,
  		AddBlogComponent,
  		FeaturedsComponent,
  		AddFeaturedComponent,
		AddCategoryComponent,
		sanitizeHtmlPipe,
  		ContactUsComponent,
 		NewsletterComponent,

		AnnouncementsComponent,
		AddAnnouncementsComponent

	],
	imports: [
		CommonModule,
		CKEditorModule,
		InlineSVGModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		NgxPaginationModule,
		NgbModule,
		DataTablesModule,
		MaterialModule,
		AngularEditorModule,
		RouterModule.forChild([

			{
				path: 'slider',
				component: SliderComponent,
			},
			{
				path: 'add-slider',
				component: AddSliderComponent,
			},
			{
				path: 'edit-slider/:id',
				component: AddSliderComponent,
			},
			{
				path: 'category',
				component: CategoriesListComponent,
			},
			{
				path: 'add-category',
				component: AddCategoryComponent,
			},
			{
				path: 'edit-category/:id',
				component: AddCategoryComponent,
			},
			{
				path: 'pages',
				component: PageListComponent,
			},
			{
				path: 'add-page',
				component: AddPageComponent,
			},
			{
				path: 'edit-page/:id',
				component: AddPageComponent,
			},
			{
				path: 'blogs',
				component: BlogsComponent,
			},

			{
				path: 'homepage',
				component: HomepageComponent,
			},
			{
				path: 'menu',
				component: MenuComponent,
			},
			{
				path:'add-home',
				component:AddHomepageComponent
			},
			{
				path:'edit-home',
				component:AddHomepageComponent
			},
			{
				path:'add-blog',
				component:AddBlogComponent
			},
			{
				path:'add-featured',
				component:AddFeaturedComponent
			},
			{
				path:'featured',
				component:FeaturedsComponent
			},
			{
				path:'conact-us',
				component:ContactUsComponent
			},
			{
				path:'newsletter',
				component:NewsletterComponent
			},
			{
				path:'announcement',
				component: AnnouncementsComponent
			},
			{
				path:'add-announcement',
				component: AddAnnouncementsComponent
			},
			{
				path: 'edit-announcement/:id',
				component: AddAnnouncementsComponent
			},


		]),
	],
	providers:[]
})
export class ManageWebsiteModule { }
