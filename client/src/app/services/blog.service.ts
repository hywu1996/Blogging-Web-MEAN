import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  httpOptions;
  domain = this.authService.domain;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  
  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    };
  }

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain+'/blogs/newBlog', blog, this.httpOptions);
  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain+'/blogs/allBlogs', this.httpOptions); 
  }
}
