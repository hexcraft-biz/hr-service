# APIs

## Employees

### Fetch Bios

Request:

```yml
```

Response:

```yml
- id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
  firstName: John
  lastName: Li

- id: 4d404df7-74d0-492c-8c66-cbf984a6a89d
  firstName: Frank
  lastName: Renn

- id: 61730286-165b-4c8e-b7da-de6601d11536
  firstName: Keira
  lastName: Ko
```

### Fetch Daily Attendance

Request:

```yml
```

Response:

```yml
totalEmployeeAmount: 3
punchedIn: 0
notPunchedIn: 3
leave: 0
```

### Fetch Daily Leave List

Request:

```yml
```

Response:

```yml
- id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
  firstName: John
  lastName: Li
  type: 特休
  start: 09:00
  end: 10:00
```

### Fetch Daily Punched List

Request:

```yml
```

Response:

```yml
- id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
  firstName: John
  lastName: Li
```

### Fetch Daily Unpunched List

Request:

```yml
```

Response:

```yml
- id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
  firstName: John
  lastName: Li
```

## Employee

### Fetch Profile

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
```

Response:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
firstName: John
lastName: Li
birthDate: 1990-01-01
gender: male
marital: single
nationality: TWN
status: employed
startDate: 2023-09-22
endDate: 
modifiedAt: 2023-09-22 18:17:34
createdAt: 2023-09-22 17:19:10
```

### Update Profile

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
firstName: John
lastName: Li
birthDate: 1990-01-01
gender: male
marital: single
nationality: TWN
status: employed
startDate: 2023-09-22
endDate: 
```

Response:

```yml
success: true
```

### Fetch Card

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
```

Response:

```yml
# Card ID
uid: 4a5abae5-438b-d82e-85e4-01504c33bae5
modifiedAt: 2023-09-22 18:17:34
createdAt: 2023-09-22 17:19:10
```

### Update Card

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
# Card ID
uid: 4a5abae5-438b-d82e-85e4-01504c33bae5
```

Response:

```yml
success: true
```

### Remove Card

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
```

Response:

```yml
success: true
```

## Employee / Attendance

### Fetch Bio

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
```

Response:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
firstName: John
lastName: Li
```

### Fetch Summary

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
month: 2023-09
```

Response:

```yml
daysAttendanceRequired: 0
daysAttendance: 0
hoursAbsence: 0
daysModificated: 0
annualLeave: 0
personalLeave: 0
```

### Fetch Daily

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
month: 2023-09
```

Response:

```yml
- date: 2023-11-11
  modified: false
  workEarly: false
  overtime: false
  defaultWorkTime: 8
  totalWorkTime: 12
  generalWorkTime: 8
  breakTime: 2
  leaveTime: 1
  absenceTime: 3

- date: 2023-11-12
  modified: true
  workEarly: true
  overtime: false
  defaultWorkTime: 7
  totalWorkTime: 15
  generalWorkTime: 9
  breakTime: 4
  leaveTime: 2
  absenceTime: 1
  
- date: 2023-11-13
  modified: false
  workEarly: false
  overtime: true
  defaultWorkTime: 5
  totalWorkTime: 7
  generalWorkTime: 3
  breakTime: 0
  leaveTime: 1
  absenceTime: 6
```

### Fetch Records

Request:

```yml
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
month: 2023-09
```

Response:

```yml
- id: 1
  type: MODIFIED
  date: 2023-11-08
  time: 20:32:30

- id: 2
  type: MODIFIED
  date: 2023-11-10
  time: 08:30:30
  
- id: 3
  type: MODIFIED
  date: 2023-11-10
  time: 18:30:30
```

### Create Record

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
type: MODIFIED
date: 2023-11-08
time: 20:32:30
```

Response:

```yml
success: true
```

### Update Record

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
# Record ID
rid: 2
type: MODIFIED
date: 2023-11-08
time: 20:32:30
```

Response:

```yml
success: true
```

### Remove Record

Request:

```yml
# User ID
id: 0150438b-85e4-4a5a-bae5-47a54c33d82e
# Record ID
rid: 2
```

Response:

```yml
success: true
```

## Enterprise

### Fetch Config

Request

```yml
```

Response

```yml
workdays 
  - MON
      shift
        start: 08:00
        end: 18:00
      break
        start: 12:00
        end: 13:00
    TUE
      shift
        start: 08:00
        end: 18:00
      break
        start: 12:00
        end: 13:00
  - THU
      shift
        start: 10:00
        end: 20:00
      break
        start: 14:00
        end: 15:00
    FRI
      shift
          start: 10:00
          end: 20:00
        break
          start: 14:00
          end: 15:00
makeUp
  mode: advance
  day: SAT
  shift
    start: 10:00
    end: 20:00
  break
    start: 14:00
    end: 15:00
```

### Update Config

Request

```yml
workdays 
  - MON
      shift
        start: 08:00
        end: 18:00
      break
        start: 12:00
        end: 13:00
    TUE
      shift
        start: 08:00
        end: 18:00
      break
        start: 12:00
        end: 13:00
  - THU
      shift
        start: 10:00
        end: 20:00
      break
        start: 14:00
        end: 15:00
    FRI
      shift
          start: 10:00
          end: 20:00
        break
          start: 14:00
          end: 15:00
makeUp
  mode: advance
  day: SAT
  shift
    start: 10:00
    end: 20:00
  break
    start: 14:00
    end: 15:00
```

Response

```yml
success: true
```
