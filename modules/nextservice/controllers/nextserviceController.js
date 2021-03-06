var exports = (module.exports = {});
const models = require("../../../models");
const { sequelize, QueryTypes, Op } = require("sequelize");
var htitle = [
  { id: "police_no", label: "NoPol", width: "", typeInput: "text", onTable: "ON" },
  { id: "no_rangka", label: "No Rangka", width: "", typeInput: "text", onTable: "OFF" },
  { id: "model", label: "Model", width: "", typeInput: "text", onTable: "ON" },
  { id: "nama", label: "Customer", width: "", typeInput: "text", onTable: "ON" },
  { id: "kategori_customer", label: "Kat. Cust", width: "", typeInput: "text", onTable: "OFF" },
  { id: "avg_omzet", label: "Avg. Omzet", width: "", typeInput: "text", onTable: "ON" },
  { id: "last_service", label: "Last Service", width: "", typeInput: "text", onTable: "ON" },
  { id: "first_class", label: "Point", width: "", typeInput: "text", onTable: "ON" },
  { id: "followup_date", label: "Last Followup", width: "", typeInput: "text", onTable: "ON" },
];

exports.index = async function (req, res) {
  var title = "Next Service";
  var tbtitle = "List Next Service";

  var today = new Date();
  today.setDate(today.getDate());
  var formattedDate = new Date(today);

  if (!req.body.start) {
    var start = new Date(formattedDate.getFullYear(), formattedDate.getMonth(), 1);
    var end = new Date(formattedDate.getFullYear(), formattedDate.getMonth() + 1, 0);
  } else {
    var start = req.body.start;
    var end = req.body.end;
  }

  const kendaraan = await models.sequelize.query(
    `SELECT
      (SELECT job.norangka from job_history AS job where job.norangka = kend.no_rangka ORDER BY job.id DESC LIMIT 1) as no_rangka,
      (SELECT job.police_no from job_history AS job where job.norangka = kend.no_rangka ORDER BY job.id DESC LIMIT 1) as police_no,
      (SELECT job.model from job_history AS job where job.norangka = kend.no_rangka ORDER BY job.id DESC LIMIT 1) as model,
      cust.nama as nama,
      custfleet.nama_fleet as nama_fleet,
      kend.kategori_customer as kategori_customer,
      kend.avg_omzet as avg_omzet,
      kend.last_service as last_service,
      kend.point_reward as first_class
    FROM 
      kendaraan AS kend
    LEFT JOIN
      customer AS cust ON cust.id_customer = kend.id_customer
    LEFT JOIN
      fleet_customer AS custfleet ON custfleet.id = kend.id_customer
    WHERE
      kend.first_class = 1
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") >= '` +
      start +
      `'
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") <= '` +
      end +
      `'`,
    {
      type: QueryTypes.SELECT,
    }
  );
  res.render("../modules/nextservice/views/index", {
    datarow: kendaraan,
    title: title,
    tbtitle: tbtitle,
    htitle: htitle,
    start: start,
    end: end,
  });
};

exports.nextfleet = async function (req, res) {
  var title = "Next Service Fleet";
  var tbtitle = "List Next Service Fleet";

  var today = new Date();
  today.setDate(today.getDate());
  var formattedDate = new Date(today);
  var d = ("0" + formattedDate.getDate()).slice(-2);
  var m = ("0" + (formattedDate.getMonth() - 5)).slice(-2);
  var fm = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
  var y = formattedDate.getFullYear();

  if (!req.body.start) {
    var start = y + "-" + m + "-" + d;
    var end = y + "-" + m + "-" + d;
    
    var fstart = y + "-" + fm + "-" + d;
    var fend = y + "-" + fm + "-" + d;
  } else {
    var fstart = new Date(req.body.start);
    var fend = new Date(req.body.end);
    
    var sd = ("0" + fstart.getDate()).slice(-2);
    var sm = ("0" + (fstart.getMonth() - 5)).slice(-2);
    var sy = fstart.getFullYear();
    var ed = ("0" + fend.getDate()).slice(-2);
    var em = ("0" + (fend.getMonth() - 5)).slice(-2);
    var ey = fend.getFullYear();
    
    var start = sy + "-" + sm + "-" + sd;
    var end = ey + "-" + em + "-" + ed;
    var fstart = (req.body.start);
    var fend = (req.body.end);
  }

  const kendaraan = await models.sequelize.query(
    `SELECT
      custfleet.nama_fleet as nama_fleet,
      kend.kategori_customer as kategori_customer,
      kend.avg_omzet as avg_omzet,
      kend.last_service as last_service,
      kend.point_reward as first_class,
      kend.model,
      kend.police_no,
      kend.no_rangka,
      (SELECT fol.followup_date from followup AS fol where fol.no_rangka = kend.no_rangka ORDER BY fol.followup_date DESC LIMIT 1) as followup_date
    FROM 
      kendaraan AS kend
    JOIN
      fleet_customer AS custfleet ON custfleet.id = kend.id_customer
    WHERE
      kend.kategori_customer = 'fleet'
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") >= '` +
      start +
      `'
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") <= '` +
      end +
      `'
    ORDER BY
      nama_fleet ASC`,
    {
      type: QueryTypes.SELECT,
    }
  );
  res.render("../modules/nextservice/views/index", {
    datarow: kendaraan,
    title: title,
    tbtitle: tbtitle,
    htitle: htitle,
    start: fstart,
    end: fend,
  });
};

exports.nextcust = async function (req, res) {
  var title = "Next Service Customer";
  var tbtitle = "List Next Service Customer";

  var today = new Date();
  today.setDate(today.getDate());
  var formattedDate = new Date(today);
  var d = ("0" + formattedDate.getDate()).slice(-2);
  var m = ("0" + (formattedDate.getMonth() - 5)).slice(-2);
  var fm = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
  var y = formattedDate.getFullYear();

  if (!req.body.start) {
    var start = y + "-" + m + "-01";
    var end = y + "-" + m + "-" + d;
    
    var fstart = y + "-" + fm + "-01";
    var fend = y + "-" + fm + "-" + d;
  } else {
    var fstart = new Date(req.body.start);
    var fend = new Date(req.body.end);
    
    var sd = ("0" + fstart.getDate()).slice(-2);
    var sm = ("0" + (fstart.getMonth() - 5)).slice(-2);
    var sy = fstart.getFullYear();
    var ed = ("0" + fend.getDate()).slice(-2);
    var em = ("0" + (fend.getMonth() - 5)).slice(-2);
    var ey = fend.getFullYear();
    
    var start = sy + "-" + sm + "-" + sd;
    var end = ey + "-" + em + "-" + ed;
    var fstart = (req.body.start);
    var fend = (req.body.end);
  }

  const kendaraan = await models.sequelize.query(
    `SELECT
      cust.nama as nama,
      kend.kategori_customer as kategori_customer,
      kend.avg_omzet as avg_omzet,
      kend.last_service as last_service,
      kend.point_reward as first_class,
      kend.model,
      kend.police_no,
      kend.no_rangka,
      (SELECT fol.followup_date from followup AS fol where fol.no_rangka = kend.no_rangka ORDER BY fol.followup_date DESC LIMIT 1) as followup_date
    FROM 
      kendaraan AS kend
    JOIN
      customer AS cust ON cust.id_customer = kend.id_customer
    WHERE
      kend.kategori_customer = 'customer'
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") >= '` +
      start +
      `'
    AND
      DATE_FORMAT(kend.last_service, "%Y-%m-%d") <= '` +
      end +
      `'
    ORDER BY
      last_service ASC`,
    {
      type: QueryTypes.SELECT,
    }
  );
  res.render("../modules/nextservice/views/index", {
    datarow: kendaraan,
    title: title,
    tbtitle: tbtitle,
    htitle: htitle,
    start: fstart,
    end: fend,
  });
};

exports.listFollowup = function (req, res) {
  const id = req.body.follownorangka;
  const date = req.body.followdate;
  models.followup
    .findAll({
      where: {
        no_rangka: id,
        last_service: date
      }
    })
    .then((data) => {
      res.send({
        success: date,
        data: data,
      });
    })
    .catch((err) => {
      res.send({
        success: 'error',
        titlemessage: "Oops!",
        message: err.message,
      });
    });
};

exports.createFollowup = function (req, res) {
  let dataFound;
  let data = {
      no_rangka: req.body.follownorangka,
      last_service: req.body.followdate,
      reason: req.body.reason,
      followup_date: new Date()
  };
  models.followup.create(data).then((resp) => {
      dataFound = resp;
      res.send({
        success: 'success',
        titlemessage: "Success",
        message: "Berhasil menambahkan data!",
      });
  }).catch((err) => {
      res.send({
        success: 'error',
        titlemessage: "Error",
        message: err.message,
      });
  });
};

exports.deleteFollowup = function (req, res) {
  let id = req.params.id;
  let customerFound;
  models.followup
    .findOne({ where: { id_followup: { [Op.eq]: id } } })
    .then((resp) => {
      customerFound = resp;
      return resp.destroy().then(() => {
        res.send({
          success: 'success',
          titlemessage: "Success",
          message: "Berhasil menambahkan data!",
        });
      });
    })
    .catch((err) => {
      res.send({
        success: 'error',
        titlemessage: "Error",
        message: err.message,
      });
    });
};
exports.notFound = function (req, res) {
  res.render("page/notfound");
};
