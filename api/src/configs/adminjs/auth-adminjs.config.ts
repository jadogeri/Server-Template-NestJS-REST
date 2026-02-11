import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import { Auth } from '../../modules/auth/entities/auth.entity';
import { last } from 'rxjs';
import { User } from '../../modules/user/entities/user.entity';



export const AuthResource: ResourceWithOptions = {
  resource: Auth,
  options: {
    properties: {
      // Add this to make it visible in the UI
      firstName: {
        type: 'string', // or 'reference' if it links to another resource
        isVisible: { 
          edit: true,   
          list: true, 
          show: true 
        },
        position: 1, // Adjust the position as needed
        // If it's a link to a Profile resource, use this:
        // reference: 'Profile', 

      },
      lastName: {
        type: 'string', // or 'reference' if it links to another resource
        isVisible: { 
          edit: true,   
          list: true, 
          show: true 
        },
        position: 2, // Adjust the position as needed
        // reference: 'Profile', 

      },
      verificationToken: {
        isVisible: false, // Hide this field in the UI
      },
      verifiedAt: {
        isVisible: false, // Hide this field in the UI
      },
      isEnabled: {
        isVisible: false, // Hide this field in the UI
      },
      isVerified: {     
        isVisible: false, // Hide this field in the UI
      },
      lastLoginAt: {
        isVisible: false, // Hide this field in the UI
      },      
      userId: {
        reference: 'User', // or 'reference' if it links to another resource
        isVisible:  false,
        position: 2, // Adjust the position as needed
        // reference: 'Profile', 

      }
      // ... your other properties
    },
    // ... actions
  }
}
