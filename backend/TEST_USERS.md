# Test Users

The following fake users are available in the mock database for testing:

## Available Test Users

All test users use the password: **`password`**

| ID | Username | Email |
|----|----------|-------|
| 1 | player1 | player1@example.com |
| 2 | speedrunner | speedrunner@example.com |
| 3 | snakemaster | snakemaster@example.com |
| 4 | gamer99 | gamer99@example.com |
| 5 | prosnake | prosnake@example.com |
| 6 | ninja | ninja@example.com |
| 7 | champion | champion@example.com |
| 8 | rookie | rookie@example.com |

## Example Login

To test with any of these users:

```json
{
  "email": "speedrunner@example.com",
  "password": "password"
}
```

## Leaderboard Data

The mock database also contains leaderboard entries for these users:

- **champion**: 505 points (Walls mode) - Top scorer!
- **snakemaster**: 450 points (Walls mode)
- **ninja**: 410 points (Pass-Through mode)
- **speedrunner**: 380 points (Walls mode), 340 points (Pass-Through mode)
- **player1**: 320 points (Pass-Through mode)
- **gamer99**: 290 points (Walls mode)
- **ninja**: 275 points (Walls mode)
- **prosnake**: 260 points (Pass-Through mode)
- **rookie**: 150 points (Walls mode)

## Notes

- All users and scores are stored in memory and will reset when the server restarts
- New users can be created via the `/auth/signup` endpoint
- Scores can be submitted via the `/leaderboard` POST endpoint (requires authentication)
