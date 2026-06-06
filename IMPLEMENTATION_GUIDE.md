# CookVerse Implementation Guide
## Steps 5-8: Frontend Features, AI Integration & Finalization

### Project Overview
**CookVerse AI** – AI-Powered Recipe Discovery & Management Platform

**Tech Stack:**
- **Backend:** Spring Boot 3.2.4, Java 17, MySQL, Spring Security, JWT
- **Frontend:** React 18, Vite, TailwindCSS, React Router v6, Axios
- **AI:** Google Gemini API (Step 6)

---

## Step 5: Frontend Recipe Features

### 5.1 Build Recipe Card, Search page, and Details page

#### Components to Create:

**A. Recipe Card Component** (`frontend/src/components/RecipeCard.jsx`)
```
Features:
- Display recipe image, title, description
- Show cuisine type, difficulty level, prep time
- Rating/favorites count
- Click to navigate to details page
- Add to favorites button
```

**B. Search Page** (`frontend/src/pages/RecipesPage.jsx`)
```
Features:
- Search recipes by name/cuisine/ingredients
- Filter by difficulty (Easy, Medium, Hard)
- Filter by cuisine type
- Pagination or infinite scroll
- Display recipe cards in grid layout
- Loading states with skeleton loaders
```

**C. Recipe Details Page** (`frontend/src/pages/RecipeDetailsPage.jsx`)
```
Features:
- Full recipe details (ingredients, instructions, nutrition)
- Recipe image carousel
- User ratings and reviews
- Print recipe functionality
- Add to favorites button
- Share on social media
- Related recipes section
```

#### Implementation Steps:

1. **Create API service layer** (`frontend/src/services/recipeService.js`)
   ```javascript
   - fetchRecipes(filters, page)
   - getRecipeById(id)
   - searchRecipes(query)
   - filterRecipes(cuisine, difficulty)
   ```

2. **Create components** with proper state management
   - Use React Context or local state for filters
   - Handle loading and error states
   - Implement responsive design with TailwindCSS

3. **Route configuration** (`frontend/src/App.jsx`)
   ```
   /recipes - Recipe listing/search
   /recipes/:id - Recipe details
   ```

---

### 5.2 Create Recipe Submission Form and "My Recipes" Dashboard

#### Components to Create:

**A. Recipe Submission Form** (`frontend/src/components/RecipeSubmissionForm.jsx`)
```
Fields:
- Recipe title (required)
- Description
- Image upload
- Ingredients list (dynamic add/remove)
- Step-by-step instructions
- Cuisine type (dropdown)
- Difficulty level (select)
- Prep/cook time
- Servings
- Tags/dietary restrictions
- Submit button
```

**B. My Recipes Dashboard** (`frontend/src/pages/MyRecipesPage.jsx`)
```
Features:
- List all recipes created by current user
- Edit recipe button
- Delete recipe button
- View recipe stats (views, ratings)
- Draft/Published status toggle
- Create new recipe button
```

#### Implementation Steps:

1. **Create API endpoints** (Backend):
   - `POST /api/recipes` - Create recipe
   - `PUT /api/recipes/{id}` - Update recipe
   - `DELETE /api/recipes/{id}` - Delete recipe
   - `GET /api/user/recipes` - Get user's recipes

2. **Form validation**
   - Client-side validation with feedback
   - Server-side validation
   - Image upload handling

3. **State management**
   - Handle form state
   - Loading/error states
   - Success notifications

---

### 5.3 Create Favorites/Bookmarks Page

#### Components to Create:

**Favorites Page** (`frontend/src/pages/FavoritesPage.jsx`)
```
Features:
- List all favorited recipes
- Remove from favorites
- Sort by date added
- Filter by cuisine type
- Empty state message
- Wishlist functionality
```

#### Implementation Steps:

1. **API endpoints** (Backend):
   - `POST /api/favorites/{recipeId}` - Add to favorites
   - `DELETE /api/favorites/{recipeId}` - Remove from favorites
   - `GET /api/favorites` - Get user's favorites

2. **Context/State for favorites**
   - Track favorite count
   - UI updates when adding/removing

---

## Step 6: Google Gemini AI Integration

### 6.1 Implement Spring Boot Service for Gemini API

#### Backend Implementation:

**1. Add Gemini Dependencies** (`backend/pom.xml`)
```xml
<dependency>
    <groupId>com.google.ai.generativelanguage</groupId>
    <artifactId>generativelanguage</artifactId>
    <version>1.0.0</version>
</dependency>
<!-- OR use REST Client approach -->
```

**2. Create Gemini Service** (`backend/src/main/java/com/cookverse/service/GeminiService.java`)
```java
@Service
public class GeminiService {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.endpoint}")
    private String endpoint;
    
    private RestTemplate restTemplate;
    
    // Generate recipe from ingredients
    public String generateRecipeFromIngredients(List<String> ingredients) {
        // Call Gemini API
    }
    
    // Generate dietary plan
    public String generateDietaryPlan(String userPreferences) {
        // Call Gemini API
    }
    
    // Analyze recipe nutrition
    public NutritionData analyzeRecipeNutrition(Recipe recipe) {
        // Call Gemini API
    }
}
```

**3. Create Recipe Controller Endpoint** 
```java
@RestController
@RequestMapping("/api/recipes/ai")
public class AIRecipeController {
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateRecipe(
        @RequestBody RecipeGenerationRequest request) {
        // Call GeminiService
    }
    
    @PostMapping("/enhance")
    public ResponseEntity<?> enhanceRecipe(
        @RequestBody Recipe recipe) {
        // Enhance existing recipe with AI
    }
}
```

**4. Application Properties** (`application.properties`)
```properties
gemini.api.key=${GEMINI_API_KEY}
gemini.api.endpoint=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

---

### 6.2 Create Frontend AI Recipe Generator Page

#### Components to Create:

**AI Recipe Generator** (`frontend/src/pages/AIRecipeGeneratorPage.jsx`)
```
Features:
- Input ingredients field (with autocomplete)
- Add multiple ingredients
- Select dietary restrictions
- Select cuisine preference
- Select meal type (breakfast, lunch, dinner)
- Generate button with loading state
- Display generated recipe results
- Save generated recipe button
- Regenerate option
```

#### Implementation:

1. **Create API service** (`frontend/src/services/aiService.js`)
   ```javascript
   generateRecipe(ingredients, preferences)
   enhanceRecipe(recipeId)
   generateDietaryPlan(userPreferences)
   ```

2. **UI Components**
   - Ingredient input with suggestions
   - Loading spinner
   - Recipe preview/result display
   - Error handling

3. **State management**
   - Store generated recipes
   - Handle API responses

---

### 6.3 Create Admin AI Recipe Wizard

#### Components to Create:

**Admin AI Wizard** (`frontend/src/pages/AdminAIWizardPage.jsx`)
```
Features:
- Pre-populate recipe from Gemini
- Edit generated content
- Customize AI suggestions
- Bulk recipe generation
- Recipe preview before save
- Admin approval workflow
```

#### Implementation:

1. **Admin endpoint** (`backend/`)
   ```
   POST /api/admin/recipes/generate-bulk
   POST /api/admin/recipes/ai-batch-process
   ```

2. **Wizard flow**
   - Step 1: Input parameters
   - Step 2: Generate recipes
   - Step 3: Review/edit
   - Step 4: Approve & publish

---

## Step 7: Admin Dashboard & Statistics

### 7.1 Implement Analytics Stats Endpoint

#### Backend Implementation:

**Analytics Service** (`backend/src/main/java/com/cookverse/service/AnalyticsService.java`)
```java
@Service
public class AnalyticsService {
    
    // KPI Metrics
    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
            .totalRecipes(countTotalRecipes())
            .totalUsers(countTotalUsers())
            .totalFavorites(countTotalFavorites())
            .averageRating(calculateAverageRating())
            .build();
    }
    
    // Recipe analytics
    public RecipeAnalytics getRecipeAnalytics(Long recipeId) {
        // Views, shares, ratings over time
    }
    
    // User analytics
    public UserAnalytics getUserAnalytics() {
        // User growth, engagement metrics
    }
    
    // Content analytics
    public ContentAnalytics getContentAnalytics() {
        // Most popular cuisines, ingredients
    }
}
```

**Analytics Controller**
```java
@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {
    
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() { }
    
    @GetMapping("/recipes")
    public ResponseEntity<List<RecipeAnalytics>> getRecipeAnalytics() { }
    
    @GetMapping("/users")
    public ResponseEntity<UserAnalytics> getUserAnalytics() { }
}
```

---

### 7.2 Create Admin Dashboard UI

#### Components to Create:

**Admin Dashboard Page** (`frontend/src/pages/AdminDashboardPage.jsx`)

**A. KPI Cards Section**
```
- Total Recipes (card)
- Total Users (card)
- Total Favorites (card)
- Average Rating (card)
- Monthly Growth (card)
- Active Users (card)
```

**B. Statistics Charts**
```javascript
Components:
- RecipesChart (bar chart - recipes by cuisine)
- UsersChart (line chart - user growth over time)
- RatingsChart (pie chart - ratings distribution)
- PopularRecipesChart (top 10 recipes)
- UserEngagementChart (engagement metrics)
```

**C. Recent Activity Section**
```
- Latest recipes
- Latest user signups
- Recent comments/reviews
```

#### Chart Library:
- Install: `npm install recharts` OR `npm install chart.js react-chartjs-2`

---

### 7.3 Create Admin Recipe Management Table

#### Components to Create:

**Admin Recipe Management** (`frontend/src/pages/AdminRecipeManagementPage.jsx`)

**Features:**
```
- Data table with columns:
  * Recipe ID
  * Title
  * Author
  * Cuisine Type
  * Rating
  * Status (Draft/Published)
  * Created Date
  * Actions (View, Edit, Delete, Override)
  
- Bulk actions:
  * Select multiple recipes
  * Bulk delete
  * Bulk status change
  
- Filters:
  * By status
  * By cuisine
  * By rating range
  * By date range
  
- Pagination
  * 10/25/50 items per page
```

#### Implementation:

1. **Backend API** for bulk operations
   ```
   DELETE /api/admin/recipes/{id}
   PUT /api/admin/recipes/{id}
   POST /api/admin/recipes/bulk-delete
   PUT /api/admin/recipes/bulk-status
   ```

2. **Table component** with sorting/filtering
   - Use a table library (e.g., react-table, TanStack)
   - Or build custom with TailwindCSS

3. **Modal for edit/override**
   - Allow admin to modify any recipe field
   - Save changes to database

---

## Step 8: UI Polishing & Walkthrough

### 8.1 Add Dark Mode Support

#### Implementation:

1. **Create Theme Context** (`frontend/src/context/ThemeContext.jsx`)
```javascript
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') === 'dark'
    );
    
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    
    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

2. **TailwindCSS Configuration** (`tailwind.config.js`)
```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {},
  },
}
```

3. **Theme Toggle Button** 
```javascript
function ThemeToggle() {
    const { isDark, setIsDark } = useTheme();
    return (
        <button onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun /> : <Moon />}
        </button>
    );
}
```

4. **Apply to Components**
   - Use `dark:` prefix in TailwindCSS classes
   - Example: `bg-white dark:bg-gray-900`

---

### 8.2 Add Skeleton Loaders

#### Components to Create:

**Skeleton Loader Component** (`frontend/src/components/SkeletonLoader.jsx`)
```javascript
export function SkeletonRecipeCard() {
    return (
        <div className="animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
        </div>
    );
}
```

**Usage in Components:**
```javascript
function RecipeList({ recipes, loading }) {
    if (loading) {
        return (
            <div className="grid gap-4">
                {[...Array(6)].map((_, i) => <SkeletonRecipeCard key={i} />)}
            </div>
        );
    }
    return <div>{/* actual content */}</div>;
}
```

---

### 8.3 Add Empty State Graphics

#### Components to Create:

**Empty State Components** (`frontend/src/components/EmptyStates.jsx`)

```javascript
export function EmptyRecipes() {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">Start by creating your first recipe</p>
            <button className="btn btn-primary">Create Recipe</button>
        </div>
    );
}

export function EmptyFavorites() {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">Add recipes to your favorites</p>
            <button className="btn btn-primary">Browse Recipes</button>
        </div>
    );
}
```

---

### 8.4 Manual System Integration Testing

#### Testing Checklist:

**Frontend Integration:**
- [ ] All pages load correctly
- [ ] Navigation works between all routes
- [ ] Forms submit properly
- [ ] API calls succeed
- [ ] Error handling displays correctly
- [ ] Loading states show properly
- [ ] Dark mode toggles correctly
- [ ] Skeleton loaders display during loading
- [ ] Empty states show when appropriate

**Backend Integration:**
- [ ] All endpoints respond correctly
- [ ] Database operations work
- [ ] Authentication/Authorization works
- [ ] Validation errors return proper status codes
- [ ] API responses have correct structure

**End-to-End Flows:**
1. User Registration & Login
2. Create Recipe → Save → View in Dashboard
3. Search Recipe → View Details → Add to Favorites
4. Generate Recipe with AI → Save → View
5. Admin Login → View Dashboard → Manage Recipes
6. Toggle Dark Mode → All pages display correctly

---

## Project Structure Reference

```
cookverse/
├── backend/
│   └── src/main/java/com/cookverse/
│       ├── controller/
│       │   ├── RecipeController.java
│       │   ├── AIRecipeController.java
│       │   ├── AnalyticsController.java
│       │   └── FavoritesController.java
│       ├── service/
│       │   ├── RecipeService.java
│       │   ├── GeminiService.java
│       │   ├── AnalyticsService.java
│       │   └── FavoritesService.java
│       ├── entity/
│       │   ├── Recipe.java
│       │   ├── User.java
│       │   ├── Favorite.java
│       │   └── Analytics.java
│       ├── repository/
│       └── CookverseApplication.java
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── RecipesPage.jsx
        │   ├── RecipeDetailsPage.jsx
        │   ├── MyRecipesPage.jsx
        │   ├── FavoritesPage.jsx
        │   ├── AIRecipeGeneratorPage.jsx
        │   ├── AdminDashboardPage.jsx
        │   ├── AdminRecipeManagementPage.jsx
        │   └── AdminAIWizardPage.jsx
        ├── components/
        │   ├── RecipeCard.jsx
        │   ├── RecipeSubmissionForm.jsx
        │   ├── SkeletonLoader.jsx
        │   ├── EmptyStates.jsx
        │   └── ThemeToggle.jsx
        ├── services/
        │   ├── recipeService.js
        │   ├── aiService.js
        │   └── analyticsService.js
        ├── context/
        │   └── ThemeContext.jsx
        ├── App.jsx
        └── main.jsx
```

---

## Configuration & Environment Setup

### Backend Environment Variables
```properties
# application.properties or application-prod.properties
spring.datasource.url=jdbc:mysql://localhost:3306/cookverse
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# Gemini AI Configuration
gemini.api.key=${GEMINI_API_KEY}
gemini.api.endpoint=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

### Frontend Environment Variables (`.env`)
```
VITE_API_URL=http://localhost:8080/api
VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
```

---

## Next Steps

1. **Install dependencies**
   - Backend: `mvn clean install`
   - Frontend: `npm install`

2. **Start development servers**
   - Backend: `mvn spring-boot:run`
   - Frontend: `npm run dev`

3. **Create database schema**
   - Run migrations/SQL scripts
   - Verify tables created

4. **Begin implementation** with Step 5.1 - Recipe Card component

5. **Test each feature** as you complete them

---

## Support & Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Google Gemini API](https://ai.google.dev)
- [React Router](https://reactrouter.com)

