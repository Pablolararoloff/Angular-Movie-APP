import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  private baseUrl = 'https://letflixnow.netlify.app/';
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
    return this.http.post<any>(`${this.baseUrl}users`, userDetails, {}).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * Making the API call for the user login endpoint
   * @param userDetails 
   * @returns an observable with the user
   */
   public userLogin(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login`, userDetails, {}).pipe(
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
    return this.http.get<any>(`${this.baseUrl}movies`, { headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || { };
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
  const encodedName = encodeURIComponent(name);
  return this.http.get<any>(`${this.baseUrl}directors/${encodedName}`).pipe(
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
  const encodedGenreName = encodeURIComponent(genreName);
  return this.http.get<any>(`${this.baseUrl}movies/genres/${encodedGenreName}`).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

   /**
   * Fetch a user by their username.
   * @param username The username of the user to retrieve.
   * @returns {Observable<any>} Observable for the API response, including user data.
   */
   getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}users/${encodeURIComponent(username)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get favourite movies for a user
  getFavouriteMovies(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}users/${username}/favorites`).pipe(
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
    return this.http.post<any>(`${this.baseUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, {}).pipe(
      catchError(this.handleError)
    );
  }

/**
   * Update user details.
   * @param userId The ID of the user to update.
   * @param userData The user data to update (username, password, email, birthday).
   * @returns {Observable<any>} Observable for the API response.
   */
updateUser(userId: string, userData: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}users/${userId}`, userData).pipe(
    catchError(this.handleError)
  );
}

 /**
   * Delete a user by ID.
   * @param userId The ID of the user to delete.
   * @returns {Observable<any>} Observable for the API response.
   */
 deleteUser(userId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}users/${userId}`).pipe(
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
  return this.http.delete<any>(`${this.baseUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`).pipe(
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse): any {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, body was: ${error.error}`);
  }
  return throwError(
    'Something bad happened; please try again later.');
}
}