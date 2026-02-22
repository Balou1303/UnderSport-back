import jwt from 'jsonwebtoken';
import http from 'http';

const secret = 'bc7da2753ac284cc50a6478a82c70917fba380ed283aefaf1feaa5a9faf6be22e24e6e204ada2487558db1e63eceb0def412e4f54d7e360fbcebb3aa8b072211';
const token = jwt.sign({ id: 1, idRole: 1 }, secret, { expiresIn: '1h' });

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/achievements/1',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}, res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.write(JSON.stringify({ label: "Ballon d'Or", type: "individual" }));
req.end();
