const nodeMailer = require("./../config/nodemailer");

function newComment(comment) {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "test@test.com",
      to: comment.user.email,
      subject: "New Comment Publiished!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail : ", err);
        return;
      }
      console.log("Message sent successfully : ", info);
      return;
    }
  );
}

module.exports = {
  newComment,
};
