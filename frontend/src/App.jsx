import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import RecipeForm from './pages/RecipeForm';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRecipes from './pages/AdminRecipes';

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
                
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/recipe/:id" element={<Details />} />

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
                    <Favorites />
                  </PrivateRoute>
                } />
                
                <Route path="/add-recipe" element={
                  <PrivateRoute>
                    <RecipeForm />
                  </PrivateRoute>
                } />

                <Route path="/edit-recipe/:id" element={
                  <PrivateRoute>
                    <RecipeForm />
                  </PrivateRoute>
                } />
                
                <Route path="/my-recipes" element={
                  <PrivateRoute>
                    <MyRecipes />
                  </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                
                <Route path="/admin/recipes" element={
                  <PrivateRoute adminOnly>
                    <AdminRecipes />
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
