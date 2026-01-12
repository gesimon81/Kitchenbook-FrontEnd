import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' }) //Singleton
export class AdminModeService {
    /*
    Choix d'un Observable pour ne pas utiliser une variable globale qui ne sera pas détectée et interceptée
    BehaviorSubject a toujours une valeur et peut aussi émettre la dernière valeur aux abonnés (Observable + Observer)
    private + asObservable() permet de déléguer la gestion de l'état au service
    */
    private adminModeSubject = new BehaviorSubject<boolean>(false);
    adminMode$ = this.adminModeSubject.asObservable();

    toggle() {
        this.adminModeSubject.next(!this.adminModeSubject.value);
    }

    isAdmin(): boolean {
        return this.adminModeSubject.value;
    }
}
