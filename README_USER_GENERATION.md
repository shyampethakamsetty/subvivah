# User Generation Script

This script generates 30 test users with Indian names and details for the Subvivah matrimonial platform.

## Features

- **30 Users Total**: 10 male, 10 female, 10 unknown gender
- **Complete Profiles**: Each user gets a full profile with Indian cultural details
- **Realistic Data**: Uses authentic Indian names, cities, religions, and occupations
- **Preferences**: Each user gets matching preferences
- **Secure Passwords**: All users have hashed passwords (default: `password123`)

## Prerequisites

Make sure you have:
1. MongoDB database running
2. Prisma client generated
3. Environment variables set up (DATABASE_URL)

## Installation & Setup

1. **Generate Prisma Client** (if not already done):
   ```bash
   npx prisma generate
   ```

2. **Run Database Migrations** (if not already done):
   ```bash
   npx prisma db push
   ```

## Running the Script

```bash
node generate-indian-users.js
```

## What Gets Created

For each user, the script creates:

### User Record
- **Required Fields**: email, password, firstName, lastName, gender, dob
- **Optional Fields**: phone, isVerified, isActive, lastLogin
- **Auto-generated**: id, createdAt, updatedAt

### Profile Record
- **Physical**: height, weight
- **Personal**: maritalStatus, religion, caste, motherTongue
- **Professional**: education, occupation, annualIncome, workLocation
- **Family**: fatherName, motherName, siblings, familyType, familyStatus
- **Personal**: aboutMe, hobbies

### Preferences Record
- **Age Range**: 18-45 years
- **Height Range**: 5'0" to 6'2"
- **Other Preferences**: religion, caste, education, occupation, location, income

## Sample Data Categories

### Names
- **Male**: Arjun, Vikram, Rahul, Amit, Rajesh, etc.
- **Female**: Priya, Anjali, Meera, Kavita, Sunita, etc.
- **Unknown**: Aadi, Advait, Arnav, Dhruv, Ishaan, etc.
- **Surnames**: Sharma, Verma, Patel, Kumar, Singh, Gupta, etc.

### Cities
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, etc.

### Religions
Hindu, Muslim, Sikh, Christian, Buddhist, Jain, Other

### Castes
Brahmin, Kshatriya, Vaishya, Shudra, Other

### Occupations
Software Engineer, Doctor, Teacher, Business Analyst, Marketing Manager, etc.

### Education
High School, Diploma, Bachelor's Degree, Master's Degree, PhD, Professional Degree

## Output

The script provides real-time feedback:
```
🚀 Starting user generation...

👨 Creating 10 male users...
✅ Created user 1: Arjun Sharma (male) - arjun.sharma123@gmail.com
✅ Created user 2: Vikram Patel (male) - vikram.patel456@yahoo.com
...

👩 Creating 10 female users...
✅ Created user 11: Priya Verma (female) - priya.verma789@gmail.com
...

❓ Creating 10 unknown gender users...
✅ Created user 21: Aadi Kumar (unknown) - aadi.kumar012@hotmail.com
...

🎉 Successfully created 30 users with profiles and preferences!

📊 Summary:
   Male users: 10
   Female users: 10
   Unknown gender users: 10
   Total users: 30
```

## Default Login Credentials

All generated users have the same password: `password123`

## Customization

You can modify the script to:
- Change the number of users per gender
- Add more variety to names, cities, or other data
- Adjust age ranges or other preferences
- Add more profile fields

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check DATABASE_URL environment variable

2. **Prisma Client Error**
   - Run `npx prisma generate` to regenerate the client

3. **Duplicate Email Error**
   - The script generates unique emails, but if you run it multiple times, you might get duplicates
   - Clear the database or modify the email generation logic

### Error Handling

The script includes error handling and will:
- Continue creating users even if some fail
- Show detailed error messages
- Provide a summary of successful vs failed creations

## Database Cleanup

If you need to clear all test data:

```bash
node clear-all-data.js
```

(Note: This will delete ALL data from the database, not just test users) 