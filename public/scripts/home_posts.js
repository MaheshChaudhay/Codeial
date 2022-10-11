{
  // method to display new post
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
    <p>
      <small>
        <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
      </small>
      ${post.content}
      <br />
      <a
      class="like-post-button"
      href="/likes/toggle/?id=${post._id}&type=Post"
      ><i class="fa-solid fa-thumbs-up"></i
    ></a>
      <small><span id="post-like-count-${post._id}">${post.likes.length}</span
      >&ensp;${post.user.name}</small>
    </p>
    <div class="post-comments">
      <form
        method="POST"
        ,
        action="/comments/create-comment?id=${post._id}"
        class="comment-form"
      >
        <input
          type="text"
          name="comment",
          placeholder="Add your comment here.."
          required
        />
        <input type="hidden" name="post" value="${post._id}" />
        <input type="submit" value="add comment" />
      </form>
      
    </div>
    <div class="post-comments-list">
      <ul id="post-comments-${post._id}">
      </ul>
    </div>
  </li>
  `);
  };

  // method to submit form data for creating new post
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit((e) => {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/",
        data: newPostForm.serialize(),
        success: function (data) {
          let post = data.data.post;
          let newPost = newPostDom(post);
          $("#posts-list-container > ul").prepend(newPost);
          deletePost($(` .delete-post-button`, newPost));
          createComment(post._id);
          toggleLikePost(post._id);
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          newPostForm[0].reset();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  //method to delete post
  const deletePost = function (deleteLink) {
    $(deleteLink).click((e) => {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log(data);
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];

      createComment(postId);
      $(`#post-comments-${postId}>li`).each(function () {
        let commentListItem = $(this);
        const commentId = $(this).attr("id").split("-")[1];
        toggleCommentLike(commentId);
        deleteComment($(` .delete-comment-button`, commentListItem), postId);
      });
      toggleLikePost(postId);
    });
    $(".remove-friend").each(function () {
      const friendId = $(this).attr("id");
      removeFriend(friendId);
    });
  };

  const newCommentDom = function (comment) {
    return $(`<li id="comment-${comment._id}">
    <p>
      <small>
        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
      </small>
       ${comment.content}
      <br />
      <small><a
      class="like-comment-button"
      href="/likes/toggle/?id=${comment._id}&type=Comment"
      ><i class="fa-solid fa-thumbs-up"></i></a>
      <span id="comment-like-count-${comment._id}">
      ${comment.likes.length}</span>&ensp; ${comment.user.name} </small>
    </p>
  </li>
  `);
  };

  const createComment = function (postId) {
    const newCommentForm = $(`#post-${postId} form`);
    newCommentForm.submit((e) => {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: `/comments/create-comment?id=${postId}`,
        data: newCommentForm.serialize(),
        success: function (data) {
          const comment = data.data.comment;
          let newComment = newCommentDom(comment);
          $(`#post-comments-${postId}`).prepend(newComment);

          deleteComment($(` .delete-comment-button`, newComment), postId);
          toggleCommentLike(comment._id);
          new Noty({
            theme: "relax",
            text: "Comment published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          newCommentForm[0].reset();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  const deleteComment = function (deleteLink, postId) {
    $(deleteLink).click((e) => {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(
            `#post-comments-${postId} #comment-${data.data.comment_id}`
          ).remove();
          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  function toggleLikePost(postId) {
    const likeButton = $(`#post-${postId} .like-post-button`);
    likeButton.click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(likeButton).prop("href"),
        success: function (data) {
          const deleted = data.data.deleted;
          const postLikeSpan = $(`#post-like-count-${postId}`);
          let postLikeCount = parseInt(postLikeSpan.text());
          if (deleted) {
            postLikeCount--;
          } else {
            postLikeCount++;
          }
          postLikeSpan.text(postLikeCount);
          new Noty({
            theme: "relax",
            text: "Post Liked successfully",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  }

  function toggleCommentLike(commentId) {
    const likeButton = $(`#comment-${commentId} .like-comment-button`);
    likeButton.click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(likeButton).prop("href"),
        success: function (data) {
          const deleted = data.data.deleted;
          const commentLikeSpan = $(`#comment-like-count-${commentId}`);
          let commentLikeCount = parseInt(commentLikeSpan.text());
          if (deleted) {
            commentLikeCount--;
          } else {
            commentLikeCount++;
          }
          commentLikeSpan.text(commentLikeCount);
          new Noty({
            theme: "relax",
            text: "Comment Liked successfully",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  }

  function removeFriend(friendId) {
    const removeFriendBtn = $(`#${friendId}`);
    console.log("removed Friend btn >>>>>", removeFriendBtn);
    removeFriendBtn.click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(removeFriendBtn).prop("href"),
        success: function (data) {
          console.log(data);
          if (data.data.deleted) {
            // const friendId = $(removeFriendBtn).prop("id");
            $(`#friend-${friendId}`).remove();
            new Noty({
              theme: "relax",
              text: "Friend Removed successfully",
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

  createPost();
  convertPostsToAjax();
}
