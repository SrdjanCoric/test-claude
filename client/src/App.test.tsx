import App from "./App";
import { render, screen } from "@testing-library/react";
import { getComments, getMoreReplies } from "./services/comments";
import userEvent from "@testing-library/user-event";
// import * as commentService from "./services/comments"

vi.mock("./services/comments.ts");

const mockedGetComments = vi.mocked(getComments);
const mockedGetMoreReplies = vi.mocked(getMoreReplies);

afterEach(() => {
  vi.resetAllMocks();
});

it("renders authors name", async () => {
  const mockedComments = [
    {
      id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
      author: "Reed Fisher",
      body: "Sint in in sunt amet.",
      postedAt: 1550488214207,
      replies_count: 3,
      replies: [
        {
          id: "116dbd01-d5f3-4dfb-afeb-f822a9264a5e",
          comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
          author: "Kathleen Nikolaus",
          body: "Officia suscipit sint sint impedit nemo. Labore aut et quia quasi ut. Eos voluptatibus quidem eius delectus beatae excepturi.",
          postedAt: 1550419941546,
        },
      ],
    },
  ];
  mockedGetComments.mockResolvedValue(mockedComments);
  render(<App />);

  const author = await screen.findByRole("heading", { name: /Reed/ });
  expect(author).toBeInTheDocument();
});

it("removes a link when show more replies is clicked", async () => {
  const mockedComments = [
    {
      id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
      author: "Reed Fisher",
      body: "Sint in in sunt amet.",
      postedAt: 1550488214207,
      replies_count: 2,
      replies: [
        {
          id: "116dbd01-d5f3-4dfb-afeb-f822a9264a5e",
          comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
          author: "Kathleen Nikolaus",
          body: "Officia suscipit sint sint impedit nemo. Labore aut et quia quasi ut. Eos voluptatibus quidem eius delectus beatae excepturi.",
          postedAt: 1550419941546,
        },
      ],
    },
  ];
  const mockedReplies = [
    {
      id: "116dbd01-d5f3-4dfb-afeb-f822a9262343214",
      comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
      author: "John Doe",
      body: "Some comment",
      postedAt: 1550419941549,
    },
  ];

  mockedGetComments.mockResolvedValue(mockedComments);
  mockedGetMoreReplies.mockResolvedValue(mockedReplies);
  render(<App />);
  const link = await screen.findByRole("link", { name: /Show More Replies/i });
  const user = userEvent.setup();
  expect(link).toBeInTheDocument();

  await user.click(link);

  const removedLink = screen.queryByRole("link", { name: /Show More Replies/ });
  expect(removedLink).not.toBeInTheDocument();
});

// waitFor + getByRole => findByRole

// waitFor + getByText => findByText

// it("renders authors name", async () => {
//   render(<App />);

//   const author = await screen.findByRole("heading", { name: /Reed/ });
//   expect(author).toBeInTheDocument();
// });
