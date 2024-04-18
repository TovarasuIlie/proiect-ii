import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { MemberEditInterface, MemberViewInterface } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<MemberViewInterface[]>(environment.apiUrl + "/api/Admin/get-members");
  }

  getMembersCount() {
    
  }

  getMember(id: string) {
    return this.http.get<MemberViewInterface>(environment.apiUrl + "/api/Admin/get-member/" + id);
  }

  editMember(editMember: MemberEditInterface) {
    return this.http.post(environment.apiUrl + '/api/Admin/add-edit-member', editMember);
  }

  getApplicationRoles() {
    return this.http.get<string[]>(environment.apiUrl + '/api/Admin/get-application-roles');
  }

  lockMember(id: string) {
    return this.http.put(environment.apiUrl + '/api/Admin/lock-member/' + id, {});
  }

  
  unlockMember(id: string) {
    return this.http.put(environment.apiUrl + '/api/Admin/unlock-member/' + id, {});
  }

  deleteMember(id: string) {
    return this.http.delete(environment.apiUrl + "/api/Admin/delete-member/" + id, {});
  }
}
