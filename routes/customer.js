const router = require("express").Router();
var customerController = require("../modules/customer/controllers/customerController.js");

router.get("/", customerController.index);
router.post("/addcustomer", customerController.createCustomer);
router.get("/delete/:id", customerController.hapusCustomer);
router.get("*", customerController.notFound);

module.exports = router;