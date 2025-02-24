import { CanDeactivate } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable,of } from "rxjs";

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  }

  @Injectable()
  export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate,
             ) {
      //    console.log("22222222222222");
       return component.canDeactivate ? component.canDeactivate() : true;
    }
  }


@Injectable()
export class DialogService {
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Are you sure?');

    return of(confirmation);
  };
}

// export interface ComponentCanDeactivate {
//   canDeactivate: () => boolean | Observable<boolean>;
// }

// @Injectable()
// export class ChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
//   constructor() {

//   }

//   canDeactivate(
//     component: ComponentCanDeactivate
//   ): boolean | Observable<boolean> {

//   return component.canDeactivate()
//         ? true
//         : confirm(
//             "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes."
//           );
//   }
// }
