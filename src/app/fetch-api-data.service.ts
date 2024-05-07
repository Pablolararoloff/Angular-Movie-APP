import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  private baseUrl = 'https://letflixnow.netlify.app';
 /**
   * @constructor
   * @param {HttpClient} http - For making HTTP requests.
   */
  constructor(private http: HttpClient) {
  }


   /**
   * Making the api call for the user registration endpoint
   * @param userDetails 
   * @returns an observable with the user
   */
   public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * Making the API call for the user login endpoint
   * @param userDetails 
   * @returns an observable with the user
   */
   public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login?' + new URLSearchParams(userDetails), {}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get All Movies endpoint
   * @returns {Observable<any>} - Observable for the API response.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call to get one movie by title.
   * @param {string} title - The title of the movie.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getMovieByTitle(title: string): Observable<any> {
    const encodedTitle = encodeURIComponent(title);
    return this.http.get(`${this.baseUrl}/movies/${encodedTitle}`).pipe(
      map(response => {
        // Optional: process the response if needed
        return response;
      }),
      catchError(this.handleError)
    );
  }


/**
 * Making the API call for the GET Director endpoint.
 * @param {string} name - The name of the Director.
 * @returns {Observable<any>} - Observable for the API response.
 */
getDirector(name: string): Observable<any> {
  const encodedName = encodeURIComponent(name); // Properly encode the director's name
  return this.http.get(`${this.baseUrl}/directors/${encodedName}`).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

/**
   * Making the API call to get genre details by the genre name.
   * @param {string} genreName - The name of the genre.
   * @returns {Observable<any>} - Observable for the API response.
   */
getGenreByName(genreName: string): Observable<any> {
  const encodedGenreName = encodeURIComponent(genreName); // Properly encode the genre name
  return this.http.get(`${this.baseUrl}/movies/genres/${encodedGenreName}`, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Assuming you have a service to handle JWT
    })
  }).pipe(
    map(response => response), // Optionally process the response
    catchError(this.handleError)
  );
}

   /**
   * Fetch a user by their username.
   * @param username The username of the user to retrieve.
   * @returns {Observable<any>} Observable for the API response, including user data.
   */
   getUserByUsername(username: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Assuming you have a service to handle JWT
    });

    return this.http.get(`${this.baseUrl}/users/${encodeURIComponent(username)}`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get favourite movies for a user
  getFavouriteMovies(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/favorites`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Add a movie to a user's favorite list.
   * @param username The username of the user.
   * @param movieId The ID of the movie to add to favorites.
   * @returns {Observable<any>} Observable for the API response, including updated user data.
   */
  addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Assuming you have a service to handle JWT
    });

    return this.http.post(`${this.baseUrl}/users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, {}, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

/**
   * Update user details.
   * @param userId The ID of the user to update.
   * @param userData The user data to update (username, password, email, birthday).
   * @returns {Observable<any>} Observable for the API response.
   */
updateUser(userId: string, userData: { Username?: string; Password?: string; Email?: string; Birthday?: Date }): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken()}` 
  });

  return this.http.put(`${this.baseUrl}/users/${userId}`, userData, { headers: headers })
    .pipe(
      catchError(this.handleError)
    );
}

 /**
   * Delete a user by ID.
   * @param userId The ID of the user to delete.
   * @returns {Observable<any>} Observable for the API response.
   */
 deleteUser(userId: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` // Assuming you have a service to handle JWT
  });

  return this.http.delete(`${this.baseUrl}/users/${userId}`, { headers: headers })
    .pipe(
      catchError(this.handleError)
    );
}

/**
   * Remove a movie from a user's favorite list.
   * @param username The username of the user.
   * @param movieId The ID of the movie to remove from favorites.
   * @returns {Observable<any>} Observable for the API response, including status message and updated user data.
   */
removeFavoriteMovie(username: string, movieId: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}` // Assuming you have a service to handle JWT
  });

  return this.http.delete(`${this.baseUrl}/users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, { headers: headers })
    .pipe(
      catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}