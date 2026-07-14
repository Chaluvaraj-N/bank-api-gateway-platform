${autogenerate.comment}
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
# TODO: Set revision/revises/branch_labels/dependencies
revision = '${up_revision}'
down_revision = ${down_revision!r}
branch_labels = ${branch_labels!r}
depends_on = ${depends_on!r}


def upgrade() -> None:
    """Upgrade migrations (placeholder)."""
    # TODO: Add operations
    pass


def downgrade() -> None:
    """Downgrade migrations (placeholder)."""
    # TODO: Add operations
    pass

