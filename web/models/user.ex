defmodule PhoenixTrello.User do
  use PhoenixTrello.Web, :model
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :encrypted_password, :string
    has_many :owned_boards, PhoenixTrello.Board
    has_many :user_boards, UserBoard
    has_many :boards, through: [:user_boards, :board]

    timestamps()
  end

  @required_fields ~w(first_name last_name email)
  @optional_fields ~w(encrypted_password)
  @derive {Poison.Encoder, only: [:id, :first_name, :last_name, :email]}

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end

   defp generate_encrypted_password(current_changeset) do
     case current_changeset do
       %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
         put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
        _->
         current_changeset
      end
    end
end
