# Identity
Identity is a Minecraft login solution

## Require
```
Node.js >= 7.2.2 (Just test at 7.2.2)
MongoDB
```

## Install 
### Source
```bash
git clone -b reload https://github.com/Indexyz/Identity.git Identity
cd Identity
nano Config.js // Edit youre config in this file
npm install 
npm run run
// Now server start at http://localhost:3000
```

### Docekr
Env List
```
DB_HOST        // Database Host
DB_PORT        // Database Port
DB_NAME        // Database Name
DB_AUTH        // Enable Database Auth(Default is false)
               // 1 => Enable  0 => Disable
DB_USER        // Database User
DB_PASS        // Database Password
SALT           // Password SALT, Please change it for safe
MAIL_KEY       // Mail Key, get it from Mailgun
MAIL_SENDER    // How send the mail
```
