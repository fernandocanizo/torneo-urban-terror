const config = require('config');


exports.up = async knex => {
  await knex.raw(`create extension if not exists unaccent`);
  await knex.raw(`create extension if not exists citext`);

  await knex.raw(`
    create table if not exists users (
      id serial primary key,
      web_nick citext not null default '',
      auth_nick varchar not null,
      discord_nick varchar not null,
      email citext not null,
      password varchar not null,
      created_at timestamp with time zone not null,
      updated_at timestamp with time zone not null,

      unique(email)
    )
  `);

  await knex.raw(`
    create table if not exists teams (
      id serial primary key,
      name varchar not null,
      tag citext not null,
      created_at timestamp with time zone not null,
      updated_at timestamp with time zone not null,

      unique(tag)
    )
  `);

  await knex.raw(`
    create table rel_user_team (
      fk_user_id integer references users(id),
      fk_team_id integer references teams(id),
      is_captain bool not null default false,
      is_subcaptain bool not null default false,

      unique(fk_user_id, fk_team_id)
    )
  `);

  // trigger functions
  await knex.raw(`
    create or replace function make_created_at_column()
    returns trigger as $$
    begin
      if new.created_at is null then
        new.created_at = now();
        new.updated_at = now();
        return new;
      else
        return new;
      end if;
    end;
    $$ language 'plpgsql'
  `);

  await knex.raw(`
    create or replace function make_updated_at_column()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language 'plpgsql'
  `);

  // add creation and updating triggers
  await knex.raw(`
    create trigger make_users_creation_time
    before insert on users
    for each row execute function make_created_at_column()
  `);

  await knex.raw(`
    create trigger make_teams_creation_time
    before insert on teams
    for each row execute function make_created_at_column()
  `);

  await knex.raw(`
    create trigger make_users_update_time
    before update on users
    for each row execute function make_updated_at_column()
  `);

  await knex.raw(`
    create trigger make_teams_update_time
    before update on teams
    for each row execute function make_updated_at_column()
  `);
};

exports.down = async knex => {
  await knex.raw(`drop table if exists rel_user_team`);
  await knex.raw(`drop table if exists teams`);
  await knex.raw(`drop table if exists users`);
  await knex.raw(`drop function make_created_at_column() cascade`);
  await knex.raw(`drop function make_updated_at_column() cascade`);
  await knex.raw(`drop extension if exists unaccent`);
  await knex.raw(`drop extension if exists citext`);
};
