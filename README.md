
# AquaPDF - PDF Tools Web Application

AquaPDF is an all-in-one PDF toolkit for editing, converting, compressing, and managing PDF documents online.

## Deployment Guide for Hostinger

### Prerequisites

- A Hostinger web hosting account
- MySQL database access
- Domain name configured with Hostinger

### Step 1: Database Setup

1. Log in to your Hostinger control panel
2. Navigate to **MySQL Databases** section
3. Create a new database (note down the database name)
4. Create a database user and assign all permissions to the database
5. Make a note of the database credentials:
   - Database Host (usually 'localhost')
   - Database Name
   - Username
   - Password

### Step 2: Configure PHP Backend

1. Update the database configuration in `public/api/config.php` with your actual database credentials:
   ```php
   $host = 'localhost'; // Usually localhost on Hostinger
   $db_name = 'your_database_name'; // Your actual database name
   $username = 'your_database_username'; // Your actual database username
   $password = 'your_database_password'; // Your actual password
   ```

2. Upload all PHP files from the `public/api` directory to your Hostinger account's `public_html/api` directory.

3. Run the database setup script by navigating to:
   ```
   https://yourdomain.com/api/setup_db.php
   ```
   This will create the necessary database tables.

### Step 3: Build and Upload Frontend

1. Build the React application for production:
   ```bash
   npm run build
   ```

2. Upload all files from the `build` or `dist` directory to your Hostinger account's `public_html` directory.

### Step 4: Configure .htaccess

Create an `.htaccess` file in your `public_html` directory with the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures that React Router works correctly for direct URL access.

### Step 5: Test Your Application

1. Visit your domain to make sure the application loads correctly
2. Test the signup and login functionality
3. Make sure PDF tools work as expected

### Troubleshooting

- If you encounter "Access denied" errors in PHP, check your database credentials
- For "500 Internal Server Error" responses, check your PHP error logs
- For React routing issues, verify the .htaccess file is correctly uploaded

## Security Recommendations

1. Keep your PHP and database credentials secure
2. Use HTTPS for your domain (Hostinger provides free SSL certificates)
3. Regularly update your application dependencies
4. Implement rate limiting for API endpoints
5. Set up database backups

## Performance Optimizations

1. Enable gzip compression in Hostinger
2. Configure browser caching
3. Optimize images and assets
4. Consider setting up a CDN for faster content delivery

## Project Structure

- `/src` - React frontend source code
- `/public/api` - PHP backend files
- `/build` or `/dist` - Compiled production files (after building)

## Contact

For questions or support, contact:
- Email: chauhansankar555@gmail.com

Developed by Sanskar Chauhan
