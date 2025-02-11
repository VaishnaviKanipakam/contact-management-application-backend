const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(express.json());
app.use(cors());

let db = null;
const initializeDbAndServer = async() => {
    try{
        db = mysql.createConnection({
        host: "localhost",
        user: "vaishu",
        password: "Bharu@96",
        database: "contact_management_application",
        insecureAuth : true
        });
        console.log("18", db)
        app.listen(3004 , () => {
            console.log('server running at loaclhost 3004')
        })
        db.connect(function(err) {
            if (err) throw err;
        })  
    } catch(e){
        process.exit(1)
    }
}

initializeDbAndServer();



// GET All Contacts API
app.get("/get_all/contacts", (request, response) => {
    const get_all_contacts = `
        SELECT 
            *
        FROM 
            contact_management;`;

    db.query(get_all_contacts, (err, result) =>{
        if(err){
            response.status(404)
            return
        }
    })
})

// POST Contacts API 
app.post("/post/contacts", (request, response) => {
    const contactDetails = request.body ;
    const {name, email, phoneNumber, address} = contactDetails;
    const creat_contact_management_table = `
        CREATE TABLE IF NOT EXISTS contact_management (
            contact_id INTEGER NOT NULL AUTO_INCREMENT,
            name VARCHAR (120),
            email VARCHAR (120),
            phone_number VARCHAR (500),
            address VARCHAR (5000),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (contact_id)
        );`;

    db.query(creat_contact_management_table, (err, result) => {
        if(err){
            response.status(401).json("Table Not Created")
            return
        }
        response.status(200)
        
        const insert_Contact_details_query = `
            INSERT INTO 
                contact_management (name, email, phone_number, address)
            VALUES (
                    "${name}", "${email}", "${phoneNumber}", "${address}"
            );`;

        db.query(insert_Contact_details_query, (err, result) => {
            if(err){
                response.status(401).json("Cannot Insert Contact Details")
                return
            }
                response.status(200).json("Contact Details Inserted Successfully")
        })
    })
})


// Update Contacts Based On ID
app.put("/put/contacts?", (request, response) => {
    const contactDetails = request.body;
    const contactId = request.query.contactId;
    const {name, email, phoneNumber, address} = contactDetails;

    if(contactDetails.name !=="" && contactDetails.email !=="" && contactDetails.phoneNumber !=="" && contactDetails.address !==""){
    const update_contact_management_table = `
        UPDATE 
            contact_management
        SET 
            name="${name}", 
            email="${email}", 
            phone_number="${phoneNumber}", 
            address="${address}"
        WHERE 
            contact_id=${contactId};`;

        db.query(update_contact_management_table, (err, result) => {
            if(err){
                response.status(401).json("Cannot Update Contact")
                return
            }
                response.status(200).json("Contact Updated Successfully");
        })
    }else{
        response.status(400).json("Enter Valid Contact")
        return 
    }
})

// DELETE Contacts API
app.delete("/delete/contacts?", (request, response) => {
    const contactId = request.query.contactId;

    const delete_contact = `
    DELETE FROM 
        contact_management
    WHERE
         contact_id=${contactId};`;

    db.query(delete_contact, (err, result) => {
        if(err){
            response.status(500).json("Cannot Delete Contact");
            return
        }
        response.status(200).json("Contact Deleted Successfully")
    })
})

// GET Contact  Based On ID API
app.get("/get/contacts?", (request, response) => {
    const contactId = request.query.contactId;
    const get_contact_query = `
        SELECT 
            *
        FROM
            contact_management
        WHERE
            contact_id=${contactId};`;

    db.query(get_contact_query, (err, result) => {
        if(err){
            response.status(500).json("Cannot Get Contact");
            return
        }
            response.status(200).json("Contact Fetched Successfully");
    })
})