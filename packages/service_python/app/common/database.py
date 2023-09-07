from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from app.settings import config


DBEngine = create_engine(
    config.PG_DSN,
    pool_size=10,
    max_overflow=100,
    pool_recycle=3600,
    echo=config.PG_ECHO,
    echo_pool=config.PG_ECHO_POOL
)
DBSession = scoped_session(sessionmaker(bind=DBEngine, autoflush=False))

BaseModel = declarative_base()
