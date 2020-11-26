const config = require('config');


exports.up = async knex => {
  await knex.raw(`create extension if not exists unaccent`);
  await knex.raw(`create extension if not exists citext`);

  await knex.raw(`
    create table if not exists clan (
      id serial primary key,
      name varchar not null,
      tag varchar(10) not null,
      created_at timestamp with time zone not null,
      updated_at timestamp with time zone not null,

      unique(tag)
    )
  `);

  await knex.raw(`
    create table if not exists player (
      id serial primary key,
      web_nick citext not null default '',
      auth_nick varchar not null,
      discord_nick varchar not null,
      email citext not null,
      password varchar not null,
      fk_clan_id integer references clan(id),
      created_at timestamp with time zone not null,
      updated_at timestamp with time zone not null,

      unique(email)
    )
  `);

  await knex.raw(`
    create table if not exists team (
      id serial primary key,
      name varchar not null,
      tag varchar(10) not null,
      created_at timestamp with time zone not null,
      updated_at timestamp with time zone not null,

      unique(tag)
    )
  `);

  await knex.raw(`
    create table rel_player_team (
      fk_player_id integer references player(id),
      fk_team_id integer references team(id),
      is_captain bool not null default false,
      is_subcaptain bool not null default false,

      unique(fk_player_id, fk_team_id)
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
    create trigger make_clan_creation_time
    before insert on clan
    for each row execute function make_created_at_column()
  `);

  await knex.raw(`
    create trigger make_player_creation_time
    before insert on player
    for each row execute function make_created_at_column()
  `);

  await knex.raw(`
    create trigger make_team_creation_time
    before insert on team
    for each row execute function make_created_at_column()
  `);

  await knex.raw(`
    create trigger make_clan_update_time
    before update on clan
    for each row execute function make_updated_at_column()
  `);

  await knex.raw(`
    create trigger make_player_update_time
    before update on player
    for each row execute function make_updated_at_column()
  `);

  await knex.raw(`
    create trigger make_team_update_time
    before update on team
    for each row execute function make_updated_at_column()
  `);
};

exports.down = async knex => {
  await knex.raw(`drop table if exists rel_player_team`);
  await knex.raw(`drop table if exists team`);
  await knex.raw(`drop table if exists player`);
  await knex.raw(`drop table if exists clan`);
  await knex.raw(`drop function make_created_at_column() cascade`);
  await knex.raw(`drop function make_updated_at_column() cascade`);
  await knex.raw(`drop extension if exists unaccent`);
  await knex.raw(`drop extension if exists citext`);
};
