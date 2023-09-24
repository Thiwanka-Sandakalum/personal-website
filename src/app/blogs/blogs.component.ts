import { Component } from '@angular/core';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  constructor(public projectService: ProjectService) { }
  blogPosts: any[] | undefined;
  selectedPostId: number | null = null;

  ngOnInit() {
    // this.blogPosts = this.projectService.getBlogPosts();

    this.projectService.getBlogPosts().subscribe(posts => {
      this.blogPosts = posts;
    });


  }
}
