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
      <small>${post.user.name}</small>
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
        deleteComment($(` .delete-comment-button`, commentListItem), postId);
      });
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
      <small> ${comment.user.name} </small>
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
          // console.log(data);
          const comment = data.data.comment;
          let newComment = newCommentDom(comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          console.log(
            "delete anchor tag",
            $(` .delete-comment-button`, newComment)
          );
          deleteComment($(` .delete-comment-button`, newComment), postId);
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

  createPost();
  convertPostsToAjax();
}
