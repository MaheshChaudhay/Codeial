function toggleFriend() {
  const toggleFriendBtn = $("#toggle-friend");
  console.log(toggleFriendBtn);
  console.log($(toggleFriendBtn).text());
  toggleFriendBtn.click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "get",
      url: $(toggleFriendBtn).prop("href"),
      success: function (data) {
        if (data.data.deleted) {
          $(toggleFriendBtn).text("Add Friend");
          new Noty({
            theme: "relax",
            text: "Friend Removed successfully",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        } else {
          $(toggleFriendBtn).text("Remove Friend");
          new Noty({
            theme: "relax",
            text: "Friend Added successfully",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        }
      },
      error: function (err) {
        console.log(err.responseText);
      },
    });
  });
}

toggleFriend();
