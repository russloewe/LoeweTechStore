// Import types
import {
    User, GetUserStatus_ResPayload
} from '../interfaces/userInterface';

// testUser matches the test user in the database defined in ./db/users.sql
export let testUser: User = {
    user_id: 1,
    name: 'TEST USER',
    password: 'PASSWORD',
    email: 'test@test.com',
    user_type: 0
}
export let testUser2: User = {
    user_id: 2,
    name: 'test',
    password: 'test',
    email: 'test@test.com',
    user_type: 0
}
export let testUserStatusPayload: GetUserStatus_ResPayload = {
    user: testUser,
    isAuthenticated: true,
    error: false
};

export let testSession =  {
    sid: 'testsid',
    user: testUser,
    loggedIn: true

};