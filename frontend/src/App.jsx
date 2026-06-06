import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Stubs to be populated in Step 5, 6, and 7 */}
                <Route path="/" element={
                  <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Home Page Stub</h2>
                      <p className="mt-2 text-slate-500">CookVerse Discovery Home Screen is coming up next.</p>
                    </div>
                  </div>
                } />
                
                <Route path="/search" element={
                  <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Search & Explore Stub</h2>
                      <p className="mt-2 text-slate-500">Search page functionality will be wired in Step 5.</p>
                    </div>
                  </div>
                } />
                
                <Route path="/recipe/:id" element={
                  <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Recipe Details Stub</h2>
                      <p className="mt-2 text-slate-500">View detailed preparation steps and cooking guides.</p>
                    </div>
                  </div>
                } />

                {/* User Protected Routes */}
                <Route path="/generate-ai" element={
                  <PrivateRoute>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Recipe Generator</h2>
                        <p className="mt-2 text-slate-500">Input ingredients and generate recipes using Gemini AI (Step 6).</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                
                <Route path="/favorites" element={
                  <PrivateRoute>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Favorites</h2>
                        <p className="mt-2 text-slate-500">View bookmarked community and AI recipes.</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                
                <Route path="/add-recipe" element={
                  <PrivateRoute>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Add Recipe Form</h2>
                        <p className="mt-2 text-slate-500">Submit manual recipe with image attachment.</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                
                <Route path="/my-recipes" element={
                  <PrivateRoute>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Uploaded Recipes</h2>
                        <p className="mt-2 text-slate-500">Manage, edit, or delete recipes you authored.</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                  <PrivateRoute>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">User Profile</h2>
                        <p className="mt-2 text-slate-500">Update account credentials and view personal cook stats.</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <PrivateRoute adminOnly>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h2>
                        <p className="mt-2 text-slate-500">Visual database stats and operations analytics (Step 7).</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                
                <Route path="/admin/recipes" element={
                  <PrivateRoute adminOnly>
                    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Recipe Management</h2>
                        <p className="mt-2 text-slate-500">Search and force remove database content entries.</p>
                      </div>
                    </div>
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
