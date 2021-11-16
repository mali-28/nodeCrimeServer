const express = require("express");
const router = express.Router();
const uniqid = require("uniqid")

let applications = []
const deletedApplications = [];

router.post("/", (req, res) => {
    const body = req.body
    const appId = uniqid()
    if (body) {
        const newApplication = {
            userId: body.userId,
            appId,
            city: body.city,
            report: body.report,
            cnic: body.cnic,
            date: new Date(),
            des: body.des,
            status : "pending"
        }

        applications.push(newApplication);
        res.contentType("application/json")
        res.status(202).json({ result: newApplication })

    } else {
        res.status(404).json({ message: "bad request" })
    }

})

router.get("/", (req,res)=>{
    res.status(200).json({applications})  
})

router.put("/status", (req,res) =>{
    const appId = req.body.appId;
    const status = req.body.status

    if(appId && status){
        applications = applications.map((application) => {
            if (application.appId === appId) {
              const activeApplication = { ...application, status}
              res.contentType("application/json")
              res.status(200).json(activeApplication)
              return activeApplication
            }
            return application;
          })
      
    }
})

router.delete("/delete", (req,res)=>{
    const appId = req.body.appId
    let copyApplication = [...applications]
    if(appId){
        const appIndex = copyApplication.findIndex(application => application.appId === appId)
        if(appIndex > -1){
            const app = copyApplication[appIndex]
            res.status(200).json({application : app})
            deletedApplications.push(app)
            applications = copyApplication.splice(appIndex, 1)
        }else{
        res.status(404).json({message : "something went wrong"})
        }
    }else{
        res.status(404).json({message : "bad request"})

    }
})


module.exports = router;