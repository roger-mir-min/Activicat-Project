//navigate to specified path + fragment
// utility/navigation.ts
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

export function navigateToAnchor(
    //Com que no es pot injectar fora de constructor o semblant
    //s'ha de passar el router i la location al component
    path: string, fragment: string, router: Router, location: Location
) {
  if (fragment) {
    router.navigate([`/${path}`], { fragment: fragment }).then(() => {
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          location.replaceState(`/${path}#` + fragment);
        }
      }, 200);
    });
  } else {
    router.navigate([`/${path}`]);
  }
}

export function navigateToAnchWithQueryPar(
  // Com que no es pot injectar fora de constructor o semblant
  // s'ha de passar el router i la location al component
  url: { path: string, fragment: string, queryParams?: Record<string, any> },
  router: Router,
  location: Location
) {
  const { path, fragment, queryParams } = url;
  const queryParamString = queryParams ? `?${serialize(queryParams)}` : '';
  const fullUrl = `/${path}${queryParamString}#${fragment}`;

  router.navigate([fullUrl]).then(() => {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        location.replaceState(fullUrl);
      }
    }, 200);
  });
}

export function serialize(obj: Record<string, any>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      // Convertir el valor a una cadena JSON si es un objeto
      const valueString = typeof value === 'object' ? JSON.stringify(value) : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(valueString)}`;
    })
    .join('&');
}



export {}  // add this line to indicate that this is a module