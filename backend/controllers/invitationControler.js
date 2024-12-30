// const InvitationCode = require('../models/InvitationCode');

// exports.createInvitationCode = async (req, res) => {
//     console.log(req.body);
  
    
//     if (!code) {
//       return res.status(400).json({ message: 'Invitation code is required' });
//     }
  
//     try {
//       const expiresAt = new Date();
//       expiresAt.setMinutes(expiresAt.getMinutes() + 10);  
  
//       const invitationCode = new InvitationCode({
//         code,  // Use the provided code
//         expiresAt,
//       });
  
//       await invitationCode.save();
  
//       res.status(201).json({
//         message: 'Invitation code created successfully',
//         invitationCode: code, 
//         expiresAt: expiresAt.toISOString(),
//       });
//     } catch (err) {
//       console.error('Error creating invitation code:', err);
//       res.status(500).json({
//         message: 'Server error',
//         error: err.message,
//       });
//     }
//   };
  
