# Macrology Development Flashcards

## Backend Concepts

### Card 1: What is a RESTful API endpoint?
**Front:** What is a RESTful API endpoint and what are the common HTTP methods?

**Back:** 
- An API endpoint is a URL where your frontend can request data from the backend
- Common HTTP methods:
  - **GET** - Retrieve data (read-only)
  - **POST** - Create new data
  - **PUT** - Update/replace existing data
  - **DELETE** - Remove data
- Example: `GET /api/meals/:id` retrieves a specific meal

---

### Card 2: What is an UPSERT operation?
**Front:** What is an UPSERT and when would you use it?

**Back:**
- UPSERT = **UP**date or in**SERT**
- Single operation that either creates a new record OR updates if it already exists
- PostgreSQL syntax: `INSERT ... ON CONFLICT (column) DO UPDATE SET ...`
- Use case: User profile - create if first time, update if returning
- Avoids needing separate "check if exists, then insert or update" logic

---

### Card 3: Path Parameters vs Query Parameters
**Front:** What's the difference between path parameters and query parameters in URLs?

**Back:**
- **Path parameters**: Part of the URL path, identifies a specific resource
  - Example: `/api/meals/:id` where `:id` is dynamic
  - Access in Express: `req.params.id`
  - Use for: Required identifiers
  
- **Query parameters**: After `?` in URL, optional filters/options
  - Example: `/api/foods?search=chicken&limit=10`
  - Access in Express: `req.query.search`, `req.query.limit`
  - Use for: Optional filtering, pagination, sorting

---

### Card 4: JWT Authentication Flow
**Front:** How does JWT authentication work between frontend and backend?

**Back:**
1. User logs in with email/password
2. Backend verifies credentials, creates JWT token containing user info
3. Backend sends token to frontend
4. Frontend stores token (localStorage or memory)
5. Frontend includes token in subsequent requests: `Authorization: Bearer <token>`
6. Backend middleware verifies token, extracts user info, adds to `req.user`
7. Protected routes can now access `req.user.id` to verify ownership

---

### Card 5: Middleware in Express
**Front:** What is middleware in Express and how does it work?

**Back:**
- Middleware = Functions that run BEFORE your route handler
- Has access to `req`, `res`, and `next()`
- Can:
  - Modify request/response objects
  - End the request-response cycle
  - Call `next()` to pass control to next middleware
- Example: `verifyToken` middleware decodes JWT and adds `req.user` before route handler runs
- Order matters: middleware executes in the order you define it

---

### Card 6: Database Migrations
**Front:** What are database migrations and why use them?

**Back:**
- Migrations = Version control for your database schema
- Each migration is a timestamped file with schema changes
- Benefits:
  - Track all database changes over time
  - Can roll back if needed
  - Team members can sync database structure
  - Production databases can be updated safely
- Example: `007_add_nutrition_targets_to_user_profiles.sql`
- Migrations table tracks which have already run

---

### Card 7: SQL Joins
**Front:** What do SQL JOINs do and when do you use them?

**Back:**
- JOINs combine rows from two or more tables based on related columns
- **INNER JOIN**: Returns only matching rows from both tables
- Example use case: Getting meal details
  - Join `meals` table with `meal_foods` (what foods are in the meal)
  - Join `meal_foods` with `foods` (get nutrition data for each food)
- Without joins: Need 3 separate queries and manual combining
- With joins: Single query gets all related data

---

### Card 8: Authentication vs Authorization
**Front:** What's the difference between authentication and authorization?

**Back:**
- **Authentication**: Proving who you are
  - "Are you really user X?"
  - Example: Login with email/password, get JWT token
  
- **Authorization**: Proving you have permission
  - "Are you allowed to access this resource?"
  - Example: Checking if meal belongs to logged-in user before showing details
  
Both are needed: First authenticate (who are you?), then authorize (can you access this?)

---

## Database Concepts

### Card 9: Foreign Keys
**Front:** What is a foreign key and why use it?

**Back:**
- Foreign key = Column that references primary key in another table
- Creates relationship between tables
- Example: `meals.user_id` references `users.id`
- Benefits:
  - Enforces referential integrity (can't have meal with non-existent user)
  - Can cascade deletes (delete user → delete their meals)
  - Makes relationships explicit and documented

---

### Card 10: Indexes in Databases
**Front:** What are database indexes and when should you use them?

**Back:**
- Index = Special data structure that speeds up data retrieval
- Like a book index - instead of reading every page, jump directly to what you need
- Trade-off: Faster reads, slightly slower writes (index must be updated)
- Create index on columns used in:
  - WHERE clauses (filtering)
  - JOIN conditions
  - ORDER BY clauses
- Example: `CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id)`

---

### Card 11: NULL vs Default Values
**Front:** When should you use NULL vs a default value in database columns?

**Back:**
- **NULL**: Absence of a value, "unknown" or "not applicable"
  - Use when: Optional data that user hasn't provided yet
  - Example: `target_calories` is NULL until user sets their goals
  
- **Default value**: Actual value assigned if none provided
  - Use when: Reasonable fallback exists
  - Example: `created_at TIMESTAMP DEFAULT NOW()`
  
NULL means "I don't know", default means "use this if not specified"

---

## TypeScript Concepts

### Card 12: Interfaces in TypeScript
**Front:** What is a TypeScript interface and why use it?

**Back:**
- Interface = Contract that defines the shape of an object
- Specifies what properties exist and their types
- Benefits:
  - Catch errors at compile time (before running code)
  - Autocomplete in VS Code
  - Self-documenting code
- Example:
```typescript
interface MealDetail {
  id: number;
  name: string;
  foods: FoodInMeal[];
}
```
- Can't use wrong property names or types

---

### Card 13: Type Safety
**Front:** What is type safety and how does TypeScript provide it?

**Back:**
- Type safety = Compiler ensures you use correct data types
- Prevents common bugs:
  - Accessing properties that don't exist
  - Passing wrong types to functions
  - Typos in property names
- TypeScript checks types at compile time (before code runs)
- Example error caught: `const { target_caloris } = req.body` (typo in property name)
- Trade-off: More code to write, but fewer runtime errors

---

### Card 14: Optional Properties
**Front:** What does the `?` mean in TypeScript interfaces?

**Back:**
- `?` = Optional property, may or may not be present
- Example:
```typescript
interface NutritionGoal {
  target_calories?: number;  // Can be number or undefined
  target_protein_g?: number;
}
```
- Without `?`: Property is required
- Use when: Data might not always be provided
- Example use case: User profile update - user can update just calories, or just protein, or all fields

---

## Frontend Concepts

### Card 15: What is Vite?
**Front:** What is Vite and why use it over Create React App?

**Back:**
- Vite = Modern build tool and dev server
- Benefits:
  - **Fast startup**: Uses native ES modules, doesn't bundle in dev
  - **Hot Module Replacement**: Instant updates without full page reload
  - **Optimized production builds**: Uses Rollup under the hood
- Replaced Create React App (CRA is no longer maintained)
- Configuration in `vite.config.ts`

---

### Card 16: React Router
**Front:** What is React Router and what are its core components?

**Back:**
- React Router = Library for handling navigation in React apps
- Core components:
  1. **BrowserRouter**: Wraps app, watches URL changes
  2. **Routes**: Container for all route definitions
  3. **Route**: Maps URL path to component
  4. **Link**: Navigate without page reload (instead of `<a>`)
  
- Example: User clicks "Login" link → URL changes to `/login` → React Router shows Login component
- Single Page App: No page refresh, just component swapping

---

### Card 17: Component Composition
**Front:** What does "component composition" mean in React?

**Back:**
- Building UIs by combining smaller, reusable components
- Each component has one responsibility
- Example structure:
  - `App` (routing)
    - `Home` (page layout)
      - `MealList` (displays meals)
        - `MealItem` (single meal)
  
- Benefits:
  - Reusable (use MealItem in multiple places)
  - Testable (test small pieces)
  - Maintainable (change one component, doesn't break others)

---

### Card 18: Props vs State
**Front:** What's the difference between props and state in React?

**Back:**
- **Props**: Data passed FROM parent TO child component
  - Read-only in child
  - Example: `<MealItem meal={mealData} />`
  - Like function parameters
  
- **State**: Data managed WITHIN a component
  - Can be changed by the component
  - Example: Form input values, loading status
  - Triggers re-render when changed
  
Rule: Props flow down, state stays local

---

### Card 19: Tailwind CSS Utility Classes
**Front:** What is utility-first CSS and how does Tailwind work?

**Back:**
- Utility-first: Use small, single-purpose classes instead of writing custom CSS
- Traditional CSS: Write classes like `.button-primary { background: blue; padding: 8px; }`
- Tailwind: Use existing classes: `bg-blue-600 px-4 py-2`
- Benefits:
  - No naming struggles
  - No CSS file bloat
  - Consistent spacing/colors
  - Faster development
- Trade-off: HTML can get verbose with many classes

---

### Card 20: What is the Virtual DOM?
**Front:** What is React's Virtual DOM and why does it matter?

**Back:**
- Virtual DOM = JavaScript representation of actual DOM
- When state changes:
  1. React creates new virtual DOM tree
  2. Compares with previous virtual DOM (diffing)
  3. Calculates minimal changes needed
  4. Updates only changed parts of real DOM
  
- Why it matters:
  - Real DOM manipulation is slow
  - Virtual DOM is fast (just JavaScript objects)
  - React optimizes updates automatically
  
You don't manually update DOM, React handles it efficiently

---

## Architecture Patterns

### Card 21: Microservices Architecture
**Front:** What is microservices architecture and why use it?

**Back:**
- Microservices = Breaking app into small, independent services
- Your project structure:
  - auth-service (handles login/registration)
  - meal-service (handles meals)
  - food-service (handles food database)
  - user-service (handles user profiles)
  
- Benefits:
  - Services can be developed/deployed independently
  - Easier to scale specific services
  - Team members can work on different services without conflicts
  
- Trade-off: More complex than monolith, need to manage service communication

---

### Card 22: Separation of Concerns
**Front:** What is "separation of concerns" and how is it applied?

**Back:**
- Each part of code should have ONE responsibility
- Applied at multiple levels:
  - **Routes**: Define endpoints, delegate to controllers
  - **Controllers**: Handle HTTP logic, call utilities
  - **Utilities**: Pure functions, reusable logic
  - **Middleware**: Cross-cutting concerns (auth, logging)
  
- Example: nutrition.js
  - Only calculates nutrition
  - No database access
  - No HTTP logic
  - Can be reused anywhere
  
Benefits: Easier to test, modify, and understand

---

### Card 23: API Service Layer Pattern
**Front:** What is an API service layer in frontend and why use it?

**Back:**
- Service layer = Centralized place for all API calls
- Instead of: axios calls scattered throughout components
- Create: `services/api.ts` with functions like `getMealById(id)`, `login(email, password)`
- Benefits:
  - Single place to update API URLs
  - Easy to add error handling
  - Easy to add authentication headers
  - Components stay clean, focused on UI
  - Can mock easily for testing

---

### Card 24: Environment Variables
**Front:** What are environment variables and why use them?

**Back:**
- Environment variables = Configuration values that change between environments
- Examples:
  - Development: `API_BASE_URL=http://localhost:3000`
  - Production: `API_BASE_URL=https://api.macrology.com`
  
- Benefits:
  - Don't hardcode values in code
  - Same code works in dev/staging/production
  - Keep secrets out of version control
  
- Frontend: `.env` file with `VITE_API_URL`
- Access: `import.meta.env.VITE_API_URL`

---

## Debugging & Problem Solving

### Card 25: Reading Error Messages
**Front:** How do you effectively read and debug TypeScript/JavaScript errors?

**Back:**
- Read error from **bottom to top** of stack trace
- Key info:
  1. **Error type**: SyntaxError, TypeError, ReferenceError
  2. **Error message**: What went wrong
  3. **File and line number**: Where it happened
  4. **Stack trace**: How you got there
  
- Example: "Cannot read property 'id' of undefined"
  - Something is undefined when you tried to access `.id`
  - Check: Is the object null? Did the query return no results?
  
- TypeScript errors show BEFORE running code

---

### Card 26: Common Debugging Strategies
**Front:** What are effective strategies for debugging code issues?

**Back:**
1. **Read the error message** carefully - it usually tells you what's wrong
2. **Check spelling/syntax** - typos are common (target_caloris vs target_calories)
3. **Use console.log** - Log variables to see actual values
4. **Check data flow**: 
   - Is data coming from frontend?
   - Is middleware adding req.user?
   - Is database returning data?
5. **Isolate the problem** - Comment out code to narrow down issue
6. **Check documentation** - Verify correct syntax/usage
7. **Compare working code** - Look at similar working examples

---

### Card 27: Validation Strategy
**Front:** Where should you validate data in a full-stack application?

**Back:**
- Validate in MULTIPLE places:
  
1. **Frontend (Client-side)**:
   - Quick feedback to user
   - Prevent unnecessary API calls
   - Example: Check email format before submitting
   
2. **Backend (Server-side)**:
   - ALWAYS validate here (security)
   - Client can be bypassed
   - Example: Check target_calories > 0
   
3. **Database**:
   - Constraints (NOT NULL, CHECK, UNIQUE)
   - Last line of defense
   
Never trust client-side validation alone!

---

## Learning Methodology

### Card 28: Understanding vs Memorizing
**Front:** Why is understanding configuration files more important than memorizing them?

**Back:**
- Configuration files don't need memorization because:
  - They're written once and rarely changed
  - Documentation is always available
  - Tools can generate them
  - Each project might need different config
  
- What matters:
  - Understanding WHAT each file does
  - Understanding WHY you need it
  - Knowing WHEN to modify it
  
- Example: You don't memorize tsconfig.json, but you understand "TypeScript needs this to know how to compile my code"

---

### Card 29: Breaking Down Complex Problems
**Front:** How do you approach building a complex feature from scratch?

**Back:**
1. **Understand the goal**: What should it do for the user?
2. **Break into steps**: 
   - What data is needed?
   - Where does it come from?
   - What transformations are needed?
   - Where does it go?
3. **Start simple**: Build basic version first
4. **Test incrementally**: Test each piece before moving on
5. **Refactor**: Clean up once it works
6. **Add error handling**: Handle edge cases

Example: Meal details endpoint
- Need: Meal + all its foods + nutrition totals
- Steps: Query meals → Join foods → Calculate nutrition → Return JSON

---

### Card 30: Reading Documentation Effectively
**Front:** How do you read technical documentation effectively?

**Back:**
1. **Start with "Getting Started"** - Don't jump to advanced topics
2. **Look for examples** - Code examples teach faster than explanations
3. **Check types/parameters** - What does function accept/return?
4. **Note defaults** - What happens if you don't specify something?
5. **Read error messages** - Docs often explain common errors
6. **Use search** - Don't read cover-to-cover, search for what you need
7. **Check versions** - Make sure docs match your version

Example: React Router docs show BrowserRouter example, copy and adapt it

---

## Project-Specific Knowledge

### Card 31: Macrology Database Schema
**Front:** What are the main tables in Macrology and how are they related?

**Back:**
- **users**: User accounts (id, email, password_hash)
- **user_profiles**: Nutrition goals (user_id → users.id, target_calories, etc.)
- **foods**: Food database (id, name, protein_per_100g, etc.)
- **meals**: User's meals (id, user_id → users.id, name, meal_type, date)
- **meal_foods**: Foods in meals (meal_id → meals.id, food_id → foods.id, quantity_g)

Relationships:
- One user → many meals
- One meal → many foods (through meal_foods)
- One food → used in many meals

---

### Card 32: Macrology Service Responsibilities
**Front:** What does each microservice in Macrology handle?

**Back:**
- **auth-service** (port 3001):
  - User registration
  - Login/authentication
  - JWT token generation
  
- **meal-service** (port 3002):
  - Create/read/update/delete meals
  - Get meal details with nutrition
  
- **food-service** (port 3003):
  - Food database queries
  - Search foods
  - Get food by ID
  
- **user-service** (port 3004):
  - User profile management
  - Nutrition goals CRUD
  
Each service has its own database connection and types

---

### Card 33: Macrology Frontend Routes
**Front:** What routes exist in Macrology frontend and what do they do?

**Back:**
- **/** - Home/Meal Planner
  - Drag-and-drop meal builder
  - Accessible to all (registered and unregistered)
  - Unregistered: uses localStorage
  - Registered: saves to database
  
- **/login** - Login page for existing users
- **/register** - Sign up page for new users
- **/profile** - Nutrition goals (calories, protein, carbs, fats)

Future: Protected routes (must be logged in to access certain pages)

---

### Card 34: Nutrition Calculation Logic
**Front:** How does Macrology calculate meal nutrition from foods?

**Back:**
1. Foods stored as "per 100g" values in database
2. User adds food with quantity OR servings:
   - quantity_g: grams directly
   - servings: multiply by serving_size_g to get grams
3. Calculate multiplier: `(grams / 100)`
4. Multiply each macro: `protein = protein_per_100g * multiplier`
5. Sum all foods in meal for totals

Example: 200g chicken breast (30g protein per 100g)
- Multiplier: 200/100 = 2
- Actual protein: 30 * 2 = 60g

---

### Card 35: Authentication Flow in Macrology
**Front:** Describe the complete authentication flow in Macrology

**Back:**
1. **Registration**:
   - User submits email/password to auth-service
   - Backend hashes password with bcrypt
   - Stores user in database
   - Returns JWT token

2. **Login**:
   - User submits credentials to auth-service
   - Backend verifies password hash
   - Generates JWT with user id and email
   - Returns token to frontend

3. **Using Token**:
   - Frontend stores token
   - Includes in all API requests: `Authorization: Bearer <token>`
   - Each service verifies token with verifyToken middleware
   - Middleware adds req.user for route handlers

4. **Logout**: Frontend deletes stored token

---

## Common Patterns & Best Practices

### Card 36: Error Handling Pattern
**Front:** What's the standard error handling pattern in Express?

**Back:**
```javascript
try {
  // Validate input
  if (!value || value < 0) {
    return res.status(400).json({ error: "Invalid value" });
  }
  
  // Do database operation
  const result = await pool.query(query, [params]);
  
  // Check authorization
  if (result.rows[0].user_id !== req.user.id) {
    return res.status(404).json({ error: "Not found" });
  }
  
  // Success
  res.json(result.rows[0]);
  
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
}
```

Pattern: Validate → Query → Authorize → Return

---

### Card 37: SQL Injection Prevention
**Front:** How do you prevent SQL injection attacks?

**Back:**
- **NEVER** concatenate user input into SQL strings:
  ```javascript
  // DANGER - SQL injection vulnerability
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  ```

- **ALWAYS** use parameterized queries:
  ```javascript
  // SAFE - parameters are escaped
  const query = 'SELECT * FROM users WHERE id = $1';
  pool.query(query, [req.params.id]);
  ```

- Why it works:
  - Database treats $1, $2 as values, not SQL code
  - Prevents malicious input from executing commands
  - All modern ORMs/drivers support this

---

### Card 38: HTTP Status Codes
**Front:** What do common HTTP status codes mean?

**Back:**
- **200 OK**: Success, here's your data
- **201 Created**: Success, new resource created
- **400 Bad Request**: Client sent invalid data
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource doesn't exist (or user can't access it)
- **500 Internal Server Error**: Something broke on server

Security note: Return 404 instead of 403 for unauthorized access to hide that resource exists

---

### Card 39: RESTful URL Design
**Front:** What are REST conventions for URL design?

**Back:**
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plurals: `/meals` not `/meal`
- Use HTTP methods for actions:
  - GET `/meals` - list all meals
  - GET `/meals/:id` - get specific meal
  - POST `/meals` - create meal
  - PUT `/meals/:id` - update meal
  - DELETE `/meals/:id` - delete meal
  
- Nested resources show relationships:
  - GET `/users/:userId/meals` - get user's meals
  
- Keep URLs hierarchical and predictable

---

### Card 40: Git Commit Message Convention
**Front:** What makes a good Git commit message?

**Back:**
Format: `type: brief description`

Types:
- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code restructure (no behavior change)
- **docs**: Documentation only
- **test**: Add/update tests
- **chore**: Maintenance (dependencies, config)

Good example:
```
feat: add endpoint to get meal details by ID
- includes all foods in meal
- calculates nutrition totals
- verifies user authorization
```

Bad: "fixed stuff" or "updated files"

Keep first line under 72 characters

---
