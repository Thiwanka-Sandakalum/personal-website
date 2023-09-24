import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private blogPostsUrl = 'assets/blog-data.json';
  private projectsUrl = 'assets/project-data.json';

  constructor(private http: HttpClient) { }

  getBlogPosts(): Observable<any[]> {
    console.log(this.blogPostsUrl);
    return this.http.get<any[]>(this.blogPostsUrl);
  }

  getBlogPostById(id: number): Observable<any> {
    return this.getBlogPosts().pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }


  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.projectsUrl);
  }


  // src/app/project.service.ts
  getProjectById(id: number): Observable<any> {
    return this.getAllProjects().pipe(
      map(projects => projects.find(project => project.id === id))
    );
  }

}
