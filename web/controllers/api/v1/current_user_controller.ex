defmodule PhoenixTrello.CurrentUserController do
  use PhoenixTrello.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: PhoenixTrello.SessionController

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)
  end

   def unauthenticated(conn, _params) do
     conn
     |> put_status(:forbidden)
     |> render(PhoenixTrello.SessionView, "forbidden.json", error: "Not Authenticated")
    end
end