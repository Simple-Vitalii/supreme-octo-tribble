import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedComponentsModule } from '@recipe-app-ngrx/shared-components';

export const coreComponentsRoutes: Route[] = [
  { path: '**', component: PageNotFoundComponent }
];

const components = [
  HeaderComponent,
  PageNotFoundComponent
]

@NgModule({
  imports: [
    SharedComponentsModule,
    RouterModule.forChild(coreComponentsRoutes)
  ],
  declarations: [
    components
  ],
  exports: [
    components
  ]
})
export class CoreComponentsModule {}
