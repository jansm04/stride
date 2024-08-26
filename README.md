# Stride

Stride is a platform for runners to generate and save marathon training plans. It is powered by my own algorithm backed by both extensive research and vast personal experience, designed to deliver training plans oriented towards any kind of runner. The main goal of this project was gain experience working with cloud computing and implementing a microservices architecture. As AWS is primarily used by actual companies, and this project is currently just a concept application, as of this instant I am not running any of the backend microservices in order to avoid spending lots of my own money on ECS deployments. The below content illustrates how the site works when all the services are deployed and running.

## Algorithm
Users are required to input several key factors to generate their training plan. These factors include:

- Duration (in weeks)
- Desired # of runs per week
- Target finishing time
- First long run distance
- Preferred long run day

Together these arguments are passed to algorithm and used to generate a specific plan fit for its exact runner. The current version of the algorithm includes the following features:

- A planner to match the # of runs per week with a specific schedule of run types (for example, 4 runs per week would output a weekly schedule with two easy runs, one tempo run, and one long run)
- An interval calculator that computes a peak long run distance based on your target time and determines a weekly rate of mileage increase based on your first long run distance and plan duration
- Mileage reduction in taper weeks, as all training plans have to allow for recovery

## Authentication
Users can access the website and generate training plans without an account, but if they would like to save their plans, then the site redirects them to a login/register page. Authentication is implemented using JSON Web Tokens (JWTs) and handled primarily on the user authentication service where all tokens are signed with a private key using the RS256 algorithm. This allows for a public key to be used in when authenticating requests sent to the database. Upon registration, passwords are encrypted using bcrypt before being stored in the database with the rest of the user information.

## Database
Users and training plans are stored in a MySQL database. The database is organized in a star schema with a central fact table consisting of User and Plan IDs. The User IDs are then used to make queries to a users table storing provided user information. User IDs are also used to insert, get and delete refresh tokens in an additional table. Plan IDs are connected to a plan-details table, which stores statistics for each training plan, and a workouts table, which stores each individual workout for each training plan.

## Architecture
The backend of the application is split into three microservices: authentication, database management, and training plan generation. The backend runs entirely on an Amazon Virtual Private Cloud (VPC). Requests sent from the frontend to the microservices are first directed to an Application Load Balancer (ALB) located in the public subnet, where they can be evenly distributed across different tasks for each microservice. 

The microservices themselves are deployed on Amazon Elastic Container Service (ECS) under the Fargate infrastructure to reduce operational overhead. All microservices are located in the private subnet and carry security groups that make them only accessible through the ALB. The microservices are also configured to connect to the internet via an NAT gateway located in the public subnet. This allows them to run Docker images stored in the Amazon Elastic Container Registry (ECR).

The database management service is also connected to the MySQL database, which is hosted on AWS RDS and also located on the same private subnet. For additional security, the database instance has a security group to only allow inbound requests from the database management service. 

To see a diagram of the architecture, click [here](https://github.com/jansm04/stride/blob/main/architecture.pdf).

##
Stride is an ongoing project of mine that will continue to recieve updates and improvements.