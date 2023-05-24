# Hospital-Management-System
This is a **RESTFul API** based Hospital Management System with the functionalities of CRUD operation on the following models: </br>
Note: You must have mongodb installed in your local machine for the project to run
1. Doctors
2. Patients
3. Users
4. Appointments

To get the project running in your machine use the following code:

```shell
git clone https://github.com/CEPHAL0/Hospital-Management-System
npm install
npm start
```

The URL and their respective functions are: </br>

## ROOT URL: localhost:3000/api/ </br> </br>

# ENDPOINT for Users

## users/

**Response**: JSON of all users</br> </br>

## users/:id

**Response**: JSON of user with the given ID</br> </br>

## users/register

**Params**: username, password, email, profilePicture (file)

**Response**: JSON of successful registration or error</br> </br>

## users/update/:id

**Params**: username, password, email, profilePicture (file)

**Response**: JSON of updated User or error</br> </br>

## users/delete/:id

**Response**: JSON of successful deletion message</br> </br>

## users/login

**Params**: username, password

**Response**: JWT token on successful authentication else error</br> </br>

# ENDPOINT for Patients

## patients/

**Response**: JSON of all patients</br> </br>

## patients/:id

**Response**: JSON of patient with the given ID</br> </br>

## patients/register

**Params**: name, age, gender, contactNumber, address, numberOfAppointments

**Response**: JSON of successful registration or error</br> </br>

## patients/update/:id

**Params**: name, age, gender, contactNumber, address, numberOfAppointments </br>

**Response**: JSON of updated Patient or error</br> </br>

## patients/delete/:id

**Response**: JSON of successful deletion message</br> </br>

# ENDPOINT for Doctors

## doctors/

**Response**: JSON of all doctors</br> </br>

## doctors/:id

**Response**: JSON of doctor with the given ID</br> </br>

## doctors/register

**Params**: name, age, qualification, licenseNumber, contactNumber, department

**Response**: JSON of successful registration or error</br> </br>

## doctors/update/:id

**Params**: name, age, qualification, licenseNumber, contactNumber, department

**Response**: JSON of updated doctor or error</br> </br>

## doctors/delete/:id

**Response**: JSON of successful deletion message</br> </br>

# ENDPOINT for Appointments

## appointments/

For setting appointment, you must have the following things:
1. JWT (Bearer Token): This can be obtained as a response upon successful login
2. Doctor ID: _id of the particular doctor from the database, can be obtained from **doctors/**
3. Patient ID: _id of the particular patient from the database, can be obtained from **patients/**

You must pass the Token as a header as:
 ### Authorization 
with value
### Bearer token
(Replace the token with actual token and after a space from Bearer)

Then pass the following arguments into body:
1. Doctor ID
2. Patient ID
3. Reason for appointment

Example of a JSON for body params:

```json
{
    "doctorId": "7892y31ghbsad81",
    "patientId": "81239u902130h2",
    "reason": "Leg Injury"
}
```
